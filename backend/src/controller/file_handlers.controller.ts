import express from 'express';
import csvParser from 'csv-parser';
import fs from 'fs';
import { DEFAULT_EXPENSE_TYPES, ERROR_SERVER_MSG, HEADER_J_DEBITS_JP, HEADER_NORMALIZE_EN, TIMEZONE } from '../utils/contants';
import { ExpanseUsageInfo_Model } from '../db/models/expanse_usage_info';
import logger from '../utils/logger';
import { getUserByUserId } from '../db/queries/user';
import { craeteExpanseUsageInfo } from '../db/queries/expanse_usage_infos';
import moment from 'moment';

export const uploadJDebitFile = async (req: express.Request, res: express.Response) => {
    try {
        const authToken = req.authToken;
        const user = await getUserByUserId(authToken!);
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        if (!req.file) {
            return res.status(400).json({ error: 'No CSV file uploaded.' });
        }

        const csvFile = req.file;

        // Use csv-parser to parse the CSV file
        const results: any[] = [];
        const columns: any[] = [];
        let headers: any[];

        // read whole file 
        fs.createReadStream(csvFile.path)
            .pipe(csvParser({
                skipLines: 5
            }))
            .on('data', (data) =>

                results.push(data)
            )
            .on('end', () => {
                // Find the index of the first empty object
                const startIndex = results.findIndex(item => Object.keys(item).length === 0);

                // If an empty object is found, remove all elements from it to the end
                if (startIndex != -1) {
                    results.splice(startIndex);
                }

                return res.status(200).json({
                    message: 'hi upload_file',
                    payload: {
                        path: csvFile.path,
                        results
                    }
                });
            });


    } catch (err) {
        logger.error(`[uploadJDebitFile] ${err}`);
        return res.status(500).json({ error: ERROR_SERVER_MSG });
    }
}

// Use this function to handle the upload of multiple CSV files for JDebit data processing.
export const uploadJDebitMultiFile = async (req: express.Request, res: express.Response) => {
    try {
        // Authenticate the user based on the provided auth token
        const authToken = req.authToken;
        const user = await getUserByUserId(authToken!);

        // Check if the user exists
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        // Check if any CSV files were uploaded
        if (!req.files) {
            return res.status(400).json({ error: 'No CSV files uploaded.' });
        }

        // Initialize an array to combine results from processing CSV files
        let combinedResults: string[] = [];

        // Iterate through uploaded files and process them using promises
        if (req.files && Array.isArray(req.files) && req.files.length > 0) {
            const filePromises = req.files.map(async (csvFile) => {
                try {
                    // Process the CSV file and retrieve results
                    const results = await processCSVFile(csvFile);

                    // If results are an array, accumulate them
                    if (Array.isArray(results)) {
                        // logger.debug('[uploadJDebitMultiFile] result');
                        combinedResults.push(...results); // Accumulate results in an array
                    }

                } catch (error) {
                    logger.error(`[uploadJDebitMultiFile] Error processing file ${csvFile.originalname}: ${error}`);
                }
            });

            // Wait for all file processing promises to complete
            await Promise.all(filePromises);
        }

        logger.debug('[uploadJDebitMultiFile] File processing completed.');

        // Map the processed data to use English keys and format it
        const englishData = combinedResults.map((item: any) => {
            const newItem: any = {};
            for (const japaneseKey in item) {
                const engKey = mappedDataToENG(japaneseKey);

                // Convert data based on English keys
                if (engKey) {
                    switch (engKey) {
                        case HEADER_NORMALIZE_EN.TRANSFERRED_AMOUNT_IN_JPY:
                            const normalizedAmpuntInJPY = parseFloat(item[japaneseKey].replace(/,/g, ''));
                            newItem[engKey] = normalizedAmpuntInJPY;
                            break;
                        case HEADER_NORMALIZE_EN.TRANSFERRED_DATE:
                            const formattedDateString = item[japaneseKey].replace(/\//g, '-'); // Replace slashes with dashes
                            const normalizedTransferredDate = moment.tz(formattedDateString, TIMEZONE).toDate();
                            newItem[engKey] = normalizedTransferredDate;
                            break;
                        default:
                            newItem[engKey] = item[japaneseKey];
                            break;
                    }
                }

                // Add additional keys for tracking like userId and expenseType
                newItem['userId'] = user._id;
                newItem['expenseType'] = DEFAULT_EXPENSE_TYPES[0]; // jdebits
            }
            return newItem;
        });

        // Insert the processed data into the database or update existing records if the combination of TRANSFERRED_DATE and AUTHORIZATION_CODE matches
        const expanseInfo = await Promise.all(englishData.map(async (item: any) => {
            const existingRecord = await ExpanseUsageInfo_Model.findOne({
                TRANSFERRED_DATE: item[HEADER_NORMALIZE_EN.TRANSFERRED_DATE],
                AUTHORIZATION_CODE: item[HEADER_NORMALIZE_EN.AUTHORIZATION_CODE]
            });

            if (existingRecord) {
                // If a matching record exists, update it
                existingRecord.set(item);
                return existingRecord.save();
            } else {
                // If no matching record exists, create a new one
                return await craeteExpanseUsageInfo(item);
            }
        }));

        // Return a success response with the processed data
        return res.status(200).json({
            message: 'CSV file(s) uploaded successfully.',
            payload: expanseInfo
        });
    } catch (err) {
        logger.error(`[uploadJDebitMultiFile] ${err}`);
        return res.status(500).json({ error: ERROR_SERVER_MSG });
    }
}

// Function to process a single CSV file and return a Promise
const processCSVFile = (csvFile: Express.Multer.File) => {
    return new Promise((resolve, reject) => {
        const results: string[] = [];
        fs.createReadStream(csvFile.path)
            .pipe(csvParser({
                skipLines: 5
            }))
            .on('data', (data) => {
                results.push(data)
            })
            .on('end', () => {
                // Find the index of the first empty object
                const startIndex = results.findIndex(item => Object.keys(item).length === 0);
                // If an empty object is found, remove all elements from it to the end
                if (startIndex !== -1) {
                    results.splice(startIndex);
                }
                resolve(results);
            })
            .on('error', (error) => reject(error));
    });
};

function mappedDataToENG(japaneseKey: string) {
    switch (japaneseKey) {
        case HEADER_J_DEBITS_JP.USER:
            return HEADER_NORMALIZE_EN.USER;

        case HEADER_J_DEBITS_JP.TRANSFERRED_DATE:
            return HEADER_NORMALIZE_EN.TRANSFERRED_DATE;

        case HEADER_J_DEBITS_JP.USAGE_OR_DESTINATION:
            return HEADER_NORMALIZE_EN.USAGE_OR_DESTINATION;

        case HEADER_J_DEBITS_JP.TRANSFERRED_AMOUNT_IN_JPY:
            return HEADER_NORMALIZE_EN.TRANSFERRED_AMOUNT_IN_JPY;

        case HEADER_J_DEBITS_JP.DESCRIPTION:
            return HEADER_NORMALIZE_EN.DESCRIPTION;

        case HEADER_J_DEBITS_JP.AUTHORIZATION_CODE:
            return HEADER_NORMALIZE_EN.AUTHORIZATION_CODE;

        default:
            return;
    }
}


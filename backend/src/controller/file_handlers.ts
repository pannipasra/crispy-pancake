import express from 'express';
import csvParser from 'csv-parser';
import csvReader from 'csv-reader';
import { Readable } from 'stream';
import fs from 'fs';
import { HEADER_J_DEBITS_JP, HEADER_NORMALIZE_EN } from '../utils/contants';
import { ExpanseJDebitInfo_Model } from '../db/models/expanse_jdebit';

export const deleteAllInfo = async(req: express.Request, res: express.Response) => {
    try {
        // Use Mongoose to delete all documents in the collection
        await ExpanseJDebitInfo_Model.deleteMany({});

        return res.status(200).json({ message: 'All information deleted successfully.' });
    } catch (err) {
        console.log(`An error has ocuured: ${err}`);
        return res.status(500).json({ error: 'An error has ocuured in server.' });
    }
}

export const uploadFile = (req: express.Request, res: express.Response) => {
    try {
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

                // console.log(results);

                return res.status(200).json({
                    message: 'hi upload_file',
                    payload: {
                        path: csvFile.path,
                        results
                    }
                });
            });


    } catch (err) {
        console.log(`An error has ocuured: ${err}`);
        return res.status(500).json({ error: 'An error has ocuured in server.' });
    }
}

export const uploadMultiFile = async (req: express.Request, res: express.Response) => {
    try {
        if (!req.files) {
            return res.status(400).json({ error: 'No CSV files uploaded.' });
        }

        // Use csv-parser to parse the CSV file
        let combinedResults: string[] = [];
        let normalizedHeaderResults: string[] = [];
        const mappedData: any = {};

        if (req.files && Array.isArray(req.files) && req.files.length > 0) {
            const filePromises = req.files.map(async (csvFile) => {
                try {
                    const results = await processCSVFile(csvFile);
                    if (Array.isArray(results)) {
                        console.log('result');
                        combinedResults.push(...results); // Accumulate results in an array
                    }

                } catch (error) {
                    console.error(`Error processing file ${csvFile.originalname}: ${error}`);
                }
            });

            // Wait for all file processing promises to complete
            await Promise.all(filePromises);
        }

        console.log('wow, really ended propmise???');

        // Map the data to use English keys
        const englishData = combinedResults.map((item: any) => {
            const newItem: any = {};
            for (const japaneseKey in item) {
                const engKey = mappedDataToENG(japaneseKey);
                if (engKey) {
                    switch (engKey) {
                        case HEADER_NORMALIZE_EN.TRANSFERRED_AMOUNT_IN_JPY:
                            newItem[engKey] = parseFloat(item[japaneseKey].replace(/,/g, ''));
                            break;
                        case HEADER_NORMALIZE_EN.TRANSFERRED_DATE:
                            newItem[engKey] = new Date(item[japaneseKey]);
                            break;
                        default:
                            newItem[engKey] = item[japaneseKey];
                            break;
                    }
                }

            }
            return newItem;
        });

        const expanseInfo = await ExpanseJDebitInfo_Model.insertMany(englishData);

        return res.status(200).json({
            message: 'hi upload_file',
            payload: {
                englishData,
                expanseInfo
            }
        });
    } catch (err) {
        console.log(`An error has ocuured: ${err}`);
        return res.status(500).json({ error: 'An error has ocuured in server.' });
    }
}

export const getInfoByDateFixed = async(req: express.Request, res: express.Response) => {
    try{
        const startDate = new Date('2023-07-01'); // Replace YYYY with the desired year
        const endDate = new Date('2023-07-31');   // Replace YYYY with the desired year
        
        const infos = await ExpanseJDebitInfo_Model.find({
            TRANSFERRED_DATE: {
                $gte: startDate,
                $lt: endDate
            }
        }); // .exec(); // Use exec() to execute the query and return a promise

        return res.status(200).json({ message: 'Query ok!', payload: infos });

    }catch(err){
        console.log(`An error has ocuured: ${err}`);
        return res.status(500).json({ error: 'An error has ocuured in server.' });
    }
}

export const getAllInfos = async(req: express.Request, res: express.Response) => {
    try{
        
        const infos = await ExpanseJDebitInfo_Model.find(); // .exec(); // Use exec() to execute the query and return a promise

        return res.status(200).json({ message: 'Query ok!', payload: infos });

    }catch(err){
        console.log(`An error has ocuured: ${err}`);
        return res.status(500).json({ error: 'An error has ocuured in server.' });
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
                const mappedData: any = {}; // Map the headers from Japanese to English
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


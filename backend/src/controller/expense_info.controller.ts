import express from 'express';
import logger from '../utils/logger';
import { ExpanseUsageInfo_Model } from '../db/models/expanse_usage_info';
import { getUserByUserId } from '../db/queries/user';
import { deleteAllExpenseInfosByUserId, getAllExpenseInfosByUserId, getExpenseInfosByUserIdAndRangeOfDate } from '../db/queries/expanse_usage_infos';
import { ERROR_SERVER_MSG, TIMEZONE, getNumberOfDaysInMonth } from '../utils/contants';
import { IApiResponse } from '../utils/interfaces';
import moment from 'moment-timezone';

export const getInfoByDateFixed = async (req: express.Request, res: express.Response<IApiResponse>) => {
    try {
        const authToken = req.authToken;
        const user = await getUserByUserId(authToken!);
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        const startDate = new Date('2023-07-01'); // Replace YYYY with the desired year
        const endDate = new Date('2023-07-31');   // Replace YYYY with the desired year

        const infos = await ExpanseUsageInfo_Model.find({
            TRANSFERRED_DATE: {
                $gte: startDate,
                $lt: endDate
            }
        }); // .exec(); // Use exec() to execute the query and return a promise

        return res.status(200).json({ message: 'Query ok!', payload: infos });

    } catch (err) {
        logger.error(`[getInfoByDateFixed] ${err}`);
        return res.status(500).json({ error: ERROR_SERVER_MSG });
    }
}

export const getAllInfos = async (req: express.Request, res: express.Response<IApiResponse>) => {
    try {
        const authToken = req.authToken;
        const user = await getUserByUserId(authToken!);
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        const infos = await getAllExpenseInfosByUserId(user._id);

        return res.status(200).json({ message: 'Query ok!', payload: infos });

    } catch (err) {
        logger.error(`[getAllInfos] ${err}`);
        return res.status(500).json({ error: ERROR_SERVER_MSG });
    }
}

export const deleteAllInfo = async (req: express.Request, res: express.Response<IApiResponse>) => {
    try {
        const authToken = req.authToken;
        const user = await getUserByUserId(authToken!);
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        await deleteAllExpenseInfosByUserId(user._id);

        return res.status(200).json({ message: 'All information deleted successfully.' });
    } catch (err) {
        logger.error(`[deleteAllInfo] ${err}`);
        return res.status(500).json({ error: ERROR_SERVER_MSG });
    }
}

// ---------------

export const getInfosByRangeOfDate = async (req: express.Request, res: express.Response<IApiResponse>) => {
    try {
        // Authenticate the user
        const authToken = req.authToken;
        const user = await getUserByUserId(authToken!);

        // Check if the user exists
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        // Validate request payload
        const { startDate: startDateStr, endDate: endDateStr } = req.body;
        if (!startDateStr || !endDateStr) {
            return res.status(400).json({ error: "Both startDate and endDate are required." });
        }

        // Regular expression for "yyyy-mm-dd" format
        const yyyy_mm_dd_regex = /^\d{4}-\d{2}-\d{2}$/;

        // Regular expression for "yy-mm" format
        const yy_mm_regex = /^\d{4}-\d{2}$/;

        if (yyyy_mm_dd_regex.test(startDateStr) && yyyy_mm_dd_regex.test(endDateStr)) {
            // Both dates are in "yyyy-mm-dd" format
            logger.debug("Both dates are in 'yyyy-mm-dd' format.");
        } else if (yy_mm_regex.test(startDateStr) && yy_mm_regex.test(endDateStr)) {
            // Both dates are in "yy-mm" format
            logger.debug("Both dates are in 'yyyy-mm' format.");
        } else {
            // Dates are in an invalid format
            return res.status(403).json({ error: 'Dates are in an invalid format.' });
        }

        // Parse and convert input dates to UTC
        const startDate = moment.tz(startDateStr, TIMEZONE).utc().toDate();
        const endDate = moment.tz(endDateStr, TIMEZONE).utc().toDate();

        logger.debug(`startDate: ${startDate.toISOString()}, endDate: ${endDate.toISOString()}`);

        // Fetch expense information for the user within the specified date range
        const expenseInfos = await getExpenseInfosByUserIdAndRangeOfDate(
            user._id,
            startDate,
            endDate
        );

        // Return the results
        return res.status(200).json({
            message: "ok",
            payload: {}
        });

    } catch (err) {
        logger.error(`[getInfosByUserIdAndRangeOfDate] ${err}`);
        return res.status(500).json({ error: ERROR_SERVER_MSG });
    }
}

export const getAllRoughtlyInfosYYYYMMDD = async (req: express.Request, res: express.Response<IApiResponse>) => {
    try {
        // Authenticate the user
        const authToken = req.authToken;
        const user = await getUserByUserId(authToken!);

        // Check if the user exists
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        // Find the document with the earliest date (minDate)
        const minDateInfo = await ExpanseUsageInfo_Model.findOne({}, {}, { sort: { TRANSFERRED_DATE: 1 } }).exec();

        // Find the document with the latest date (maxDate)
        const maxDateInfo = await ExpanseUsageInfo_Model.findOne({}, {}, { sort: { TRANSFERRED_DATE: -1 } }).exec();

        // Extract the TRANSFERRED_DATE values
        const minDate = minDateInfo?.TRANSFERRED_DATE;
        const maxDate = maxDateInfo?.TRANSFERRED_DATE;

        // DateList for contains roughly year-month
        const dateList = [];

        // Find Range between minDate and maxDate in MothOfYear
        if (minDate && maxDate) {
            const startDate = new Date(minDate);
            const endDate = new Date(maxDate);

            const monthsDiff = (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth());

            if (monthsDiff > 0) {
                for (let i = 0; i <= monthsDiff; i++) {
                    let year = startDate.getFullYear();
                    let month = startDate.getMonth() + i;

                    // If the month goes beyond December, adjust the year and month accordingly
                    if (month > 11) {
                        year += Math.floor(month / 12);
                        month %= 12;
                    }

                    month = month + 1; // Adding 1 to month to make it 1-based (January is 1, not 0)
                    dateList.push({ year, month });
                }
            }
        }

        res.status(200).json({
            message: "ok",
            payload: {
                dateList
            }
        });

    } catch (err) {
        logger.error(`[getAllRoughtlyInfos] ${err}`);
        return res.status(500).json({ error: ERROR_SERVER_MSG });
    }
}

export const getInfosByRangeOfDateFromRoughtlyDateYYYYMM = async (req: express.Request, res: express.Response<IApiResponse>) => {
    try {
        // Authenticate the user
        const authToken = req.authToken;
        const user = await getUserByUserId(authToken!);

        // Check if the user exists
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        // Validate request payload
        const { targetDateYM } = req.body;
        if (!targetDateYM) {
            return res.status(400).json({ error: "targetDateYM is required." });
        }

        // Regular expression for "yyyy-mm-dd" format
        const yyyy_mm_dd_regex = /^\d{4}-\d{2}-\d{2}$/;

        // Regular expression for "yy-mm" format
        const yy_mm_regex = /^\d{4}-\d{2}$/; // yyyy-mm 

        if (!yy_mm_regex.test(targetDateYM)) {
            // Dates are in an invalid format
            return res.status(403).json({ error: 'Date are in an invalid format.' });
        }

        const [year, month] = targetDateYM.split('-');
        const amountDays = getNumberOfDaysInMonth(parseInt(year), parseInt(month));

        // Combine
        const startDateStr = `${year}-${month}-01`;
        const endDateStr = `${year}-${month}-${amountDays}`;

        // Parse and convert input dates to UTC
        const startDate = moment.tz(startDateStr, TIMEZONE).utc().toDate();
        const endDate = moment.tz(endDateStr, TIMEZONE).utc().toDate();

        logger.debug(`startDate: ${startDate.toISOString()}, endDate: ${endDate.toISOString()}`);

        // Fetch expense information for the user within the specified date range
        const expenseInfos = await getExpenseInfosByUserIdAndRangeOfDate(
            user._id,
            startDate,
            endDate
        );

        let amountUseInJPY = 0;

        // Iterate through the expenseInfos array and sum up the expenses
        for (const expenseInfo of expenseInfos) {
            // Assuming each expenseInfo has a 'amountInJPY' property
            amountUseInJPY += expenseInfo.TRANSFERRED_AMOUNT_IN_JPY!;
        }

        // Return the results
        return res.status(200).json({
            message: "ok",
            payload: {
                amountUseInJPY,
                expenseInfos, 
            }
        });

    } catch (err) {
        logger.error(`[getInfosByUserIdAndRangeOfDate] ${err}`);
        return res.status(500).json({ error: ERROR_SERVER_MSG });
    }
}
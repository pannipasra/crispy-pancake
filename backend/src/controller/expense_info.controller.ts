import express from 'express';
import logger from '../utils/logger';
import { ExpanseUsageInfo_Model } from '../db/models/expanse_usage_info';
import { getUserByUserId } from '../db/queries/user';
import { deleteAllExpenseInfosByUserId, getAllExpenseInfosByUserId, getExpenseInfosByUserIdAndRangeOfDate } from '../db/queries/expanse_usage_infos';
import { ERROR_SERVER_MSG, TIMEZONE } from '../utils/contants';
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

export const getInfosByUserIdAndRangeOfDate = async (req: express.Request, res: express.Response<IApiResponse>) => {
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
            payload: expenseInfos
        });

    } catch (err) {
        logger.error(`[getInfosByUserIdAndRangeOfDate] ${err}`);
        return res.status(500).json({ error: ERROR_SERVER_MSG });
    }
}


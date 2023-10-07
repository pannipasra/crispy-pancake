import express from 'express';
import { COOKIE_CONFIGS, DEFAULT_EXPENSE_TYPES, DEFAULT_LIST_CATEGORY, ERROR_SERVER_MSG } from '../utils/contants';
import { createUserFromUsername, getUserByUsername } from '../db/queries/user';
import { createCategoryByName } from '../db/queries/category';
import logger from '../utils/logger';
import { Types } from 'mongoose';
import { craeteExpanseTypeByTypeName } from '../db/queries/expense_type';

export const register = async (req: express.Request, res: express.Response) => {
    try {
        const { username } = req.body;
        if (!username) {
            return res.status(422).json({ error: 'Username is required for registration.' });
        }

        const existingUser = await getUserByUsername(username);
        if (existingUser) {
            return res.status(409).json({ error: 'Username already exists. Please choose a different username.' });
        }

        const user = await createUserFromUsername({ username });
        if (user) {
            await mapCreateCategoryDefaultValues(DEFAULT_LIST_CATEGORY, user._id);
            await mapCreateExpenseTypeDefaultValues(DEFAULT_EXPENSE_TYPES, user._id);
        }

        return res.status(200).json({
            message: "Registed Successfully!",
            payload: user
        })
    } catch (err) {
        logger.error(`[register] ${err}`);
        return res.status(500).json({ error: ERROR_SERVER_MSG });
    }
}

export const login = async (req: express.Request, res: express.Response) => {
    try {
        const { username } = req.body;
        if (!username) {
            return res.status(422).json({ error: 'Username is required for registration.' });
        }
        const user = await getUserByUsername(username);
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }
        const token = user._id;
        // setup cookie with username for auth
        // Set a cookie with the authentication token
        res.cookie(
            COOKIE_CONFIGS.COOKIE_NAME,
            token,
            {
                domain: COOKIE_CONFIGS.LOCAL_DOMAIN,
                path: '/',
                httpOnly: true,
            }
        );

        // You can also include other data in the response if needed
        return res.status(200).json({ message: 'Login successful' }).end();

    } catch (err) {
        logger.error(`[login] ${err}`);
        return res.status(500).json({ error: ERROR_SERVER_MSG });
    }
}


const mapCreateCategoryDefaultValues = async (categoryNames: string[], userId: Types.ObjectId) => {
    const categoryPromises = categoryNames.map(async (categoryName) => {
        await createCategoryByName({ userId, categoryName });

    });

    return Promise.all(categoryPromises);
}

const mapCreateExpenseTypeDefaultValues = async (expenseTypes: string[], userId: Types.ObjectId) => {
    const expenseTypePromise = expenseTypes.map(async (expenseType) => {
        await craeteExpanseTypeByTypeName({ userId, expenseType });
    });

    return Promise.all(expenseTypePromise);
}
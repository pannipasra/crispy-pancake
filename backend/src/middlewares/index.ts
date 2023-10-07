import mongoose from "mongoose";
import express from "express";
import logger from "../utils/logger";
import { IApiResponse } from "../utils/interfaces";
import { COOKIE_CONFIGS } from "../utils/contants";
import multer from 'multer';
import appRootPaht from 'app-root-path';

export const isMonGooseConnected = async (req: express.Request, res: express.Response<IApiResponse>, next: express.NextFunction) => {
    if (mongoose.connection.readyState === 1) {
        // Mongoose is already connected (readyState 1)
        next();
    }else{
        logger.warn(`[isMonGooseConnected] Cannot connect to Mongo Database..`);
        return res.status(500).json({ error: 'Failed to connect to the database' });
    }
}


// Define a custom type for the Request object to include the 'authToken' property
declare global {
    namespace Express {
        interface Request {
            authToken?: string; // Change the type to match your actual 'authToken' property type
        }
    }
}

export const extractAuthTokenMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        // Extract the authentication token from the cookie
        const authToken = req.cookies[COOKIE_CONFIGS.EXPENSE_APP_1111];
        if (!authToken) {
            return res.status(403).json({ error: 'Required Token' });
        }
        // Attach the authToken to the request object for later use
        
        req.authToken = authToken as string;

        // Continue to the next middleware or route
        next();
    } catch (err) {
        logger.error(`An error has ocuured: ${err}`);
        return res.status(500).json({ error: 'An error has ocuured in server.' });
    }
};


// Set up storage for uploaded files
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, `${appRootPaht}/upload_files/`);
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    }
  });

export const upload = multer({ storage });
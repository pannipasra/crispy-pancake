import 'dotenv/config';
import mongoose from 'mongoose';
import logger from '../utils/logger';

export async function connectToDB() {
    try {
        logger.info('Connecting to MongoDB...');

        await mongoose.connect(process.env.MONGO_URI as string, {
            dbName: 'expanse-app',
        });

        if (mongoose.connection.readyState === 1) {
            logger.info('Connected to MongoDB.');
        } else {
            logger.error('Failed to connect to MongoDB.');
            retryConnecting();
        }
    } catch (err) {
        logger.error(`[connectDB]: ${err}`);
        retryConnecting();
    }
}

function retryConnecting() {
    // Retry the connection after a delay (e.g., 5 seconds)
    logger.warn('[retryConnecting]: Try to connect to MongoDB');
    setTimeout(connectToDB, 5000);
}
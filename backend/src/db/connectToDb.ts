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
        }
    } catch (err) {
        logger.error(`[connectDB]: ${err}`);
    }
}
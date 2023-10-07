import app from './app';
import { connectToDB } from './db/connectToDb';
import logger from './utils/logger';

const PORT = 7821;



app.listen(PORT, () => {
    logger.info(`🌈Server is running at http://localhost:${PORT} ⚡`);
});

connectToDB();
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import morganMiddleware from './middlewares/morganMiddleWare';

import fileRoute from './routes/file_handlers.route';
import userRoute from './routes/user.route';
import expenseInfoRoute from './routes/expense_info.route';

// Create app by express();
const app = express();

// Setting Middleware
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});
app.use(express.json());
app.use(morganMiddleware);
app.use(cookieParser());
// Configure CORS to allow all origins
const corsOptions = {
    origin: 'localhost',
    credentials: true, // Allow credentials (cookies) to be sent with the request
};
app.use(cors(corsOptions));

// Routes handler
app.use('/api/v1/user', userRoute);
app.use('/api/v1/file', fileRoute);
app.use('/api/v1/expense_info', expenseInfoRoute);

export default app;
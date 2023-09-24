import express from 'express';
import cors from 'cors';
import fileRoute from './routes/file_handlers';
// Create app by express();
const app = express();

// Setting Middleware
app.use(express.json());
app.use(cors());

// Routes handler
app.use('/api/v1/file', fileRoute);


export default app;
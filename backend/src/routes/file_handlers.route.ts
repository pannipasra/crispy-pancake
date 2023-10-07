import express from 'express';


import { uploadJDebitFile, uploadJDebitMultiFile } from '../controller/file_handlers.controller';
import { extractAuthTokenMiddleware, upload } from '../middlewares';

const router = express.Router();


router.post('/upload', extractAuthTokenMiddleware, upload.single('csvFile'), uploadJDebitFile);

router.post('/upload-jdbit-multi', extractAuthTokenMiddleware, upload.array('csvFiles'), uploadJDebitMultiFile);


export default router;
import express from 'express';
import { 
    deleteAllInfo, 
    getAllInfos, 
    getInfosByUserIdAndRangeOfDate 
} 
from '../controller/expense_info.controller';
import { extractAuthTokenMiddleware } from '../middlewares';

const router = express.Router();

router.get('/get-all-infos', extractAuthTokenMiddleware, getAllInfos);
router.get('/get-infos-by-range-date', extractAuthTokenMiddleware, getInfosByUserIdAndRangeOfDate)

router.delete('/delete-all', extractAuthTokenMiddleware, deleteAllInfo);


export default router;
import express from 'express';
import { 
    deleteAllInfo, 
    getAllInfos, 
    getAllRoughlyInfosYYYYMMDD , 
    getInfosByRangeOfDate, 
    getInfosByRangeOfDateFromRoughlyDateYYYYMM
} 
from '../controller/expense_info.controller';
import { extractAuthTokenMiddleware } from '../middlewares';

const router = express.Router();

router.get('/get-all-infos', extractAuthTokenMiddleware, getAllInfos);
router.get('/get-infos-by-range-date', extractAuthTokenMiddleware, getInfosByRangeOfDate)
router.get('/get-roughly-infos', extractAuthTokenMiddleware, getAllRoughlyInfosYYYYMMDD);
router.post('/get-roughly-infos-targetDate-yyyy-mm', extractAuthTokenMiddleware, getInfosByRangeOfDateFromRoughlyDateYYYYMM)

router.delete('/delete-all', extractAuthTokenMiddleware, deleteAllInfo);


export default router;
import express from 'express';
import { 
    deleteAllInfo, 
    getAllInfos, 
    getAllRoughtlyInfosYYYYMMDD, 
    getInfosByRangeOfDate, 
    getInfosByRangeOfDateFromRoughtlyDateYYYYMM
} 
from '../controller/expense_info.controller';
import { extractAuthTokenMiddleware } from '../middlewares';

const router = express.Router();

router.get('/get-all-infos', extractAuthTokenMiddleware, getAllInfos);
router.get('/get-infos-by-range-date', extractAuthTokenMiddleware, getInfosByRangeOfDate)
router.get('/get-rougtly-infos-yyyy-mm-dd', extractAuthTokenMiddleware, getAllRoughtlyInfosYYYYMMDD);
router.get('/get-rougtly-infos-targetDate-yyyy-mm', extractAuthTokenMiddleware, getInfosByRangeOfDateFromRoughtlyDateYYYYMM)

router.delete('/delete-all', extractAuthTokenMiddleware, deleteAllInfo);


export default router;
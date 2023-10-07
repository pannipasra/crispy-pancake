import { Types } from 'mongoose';
import { ExpanseUsageInfo_Model } from '../models/expanse_usage_info';

export const craeteExpanseUsageInfo = (values: Record<string, any>) =>
    new ExpanseUsageInfo_Model(values)
        .save()
        .then((info) => info.toObject());

export const getAllExpenseInfosByUserId = (id: string | Types.ObjectId) =>
    ExpanseUsageInfo_Model.find({ userId: id }).sort({ TRANSFERRED_DATE: 1 }); // 1 for ascending, -1 for descending;


export const deleteAllExpenseInfosByUserId = (userId: string | Types.ObjectId) =>
    ExpanseUsageInfo_Model.deleteMany({ userId })


export const deleteAllExpenseInfosByUserIdAndExpenseType = (
    userId: string | Types.ObjectId,
    expenseType: string
) => ExpanseUsageInfo_Model.deleteMany({ userId, expenseType })


// Customize query 
export const getExpenseInfosByUserIdAndRangeOfDate = (
    userId: string | Types.ObjectId,
    startDate: Date,
    endDate: Date
) => ExpanseUsageInfo_Model.find({
    userId,
    TRANSFERRED_DATE: {
        $gte: startDate,
        $lte: endDate
    }
}).sort({ TRANSFERRED_DATE: 1 }); // 1 for ascending, -1 for descending
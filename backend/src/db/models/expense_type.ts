import mongoose from "mongoose";

const ExpenseType_Schema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user_info',
        required: true
    },
    expenseType: {
        type: String,
        required: true
    },
    createdDate: {
        type: Date,
        default: Date.now
    }
});

export const ExpenseType_Model = mongoose.model('expense_type', ExpenseType_Schema);
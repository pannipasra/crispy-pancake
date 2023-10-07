import mongoose from "mongoose";

const ExpanseUsageInfo_Schema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user_info',
        required: true,
    },
    USER: {
        type: String
    },
    TRANSFERRED_DATE: {
        type: Date
    },
    USAGE_OR_DESTINATION: {
        type: String
    },
    TRANSFERRED_AMOUNT_IN_JPY: {
        type: Number
    },
    DESCRIPTION: {
        type: String
    },
    AUTHORIZATION_CODE: {
        type: String
    },
    category: {
        type: String, // Use String type to store categoryName
        ref: 'category', // Reference the 'category' model
    },
    tag: {
        type: String
    },
    expenseType: {
        type: String, // Add a field to store the type of expense (e.g., 'jdebits' or 'cash')
        required: true, // Make it required
        ref: 'expense_type'
    },
    createdDate: {
        type: Date,
        default: Date.now
    }
});

export const ExpanseUsageInfo_Model = mongoose.model('expanse_usage_info', ExpanseUsageInfo_Schema);

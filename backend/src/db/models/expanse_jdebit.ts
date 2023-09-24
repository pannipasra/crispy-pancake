import mongoose from "mongoose";

const ExpanseJDebitInfo_Schema = new mongoose.Schema({
    USER: String,
    TRANSFERRED_DATE: Date,
    USAGE_OR_DESTINATION: String,
    TRANSFERRED_AMOUNT_IN_JPY: Number,
    DESCRIPTION: String,
    AUTHORIZATION_CODE: String,
    createdDate: {
        type: Date,
        default: Date.now
    }
});

export const ExpanseJDebitInfo_Model = mongoose.model('expanse_jdebit_info', ExpanseJDebitInfo_Schema);

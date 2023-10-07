import mongoose from "mongoose";

const Category_Schema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user_info',
        required: true,
    },
    categoryName: {
        type: String,
    },
    createdDate: {
        type: Date,
        default: Date.now
    }
});

export const Category_Model = mongoose.model('category', Category_Schema);
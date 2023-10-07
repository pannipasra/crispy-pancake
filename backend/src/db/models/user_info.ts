import mongoose from "mongoose";

const UserInfo_Schema = new mongoose.Schema({
    username: String,
    createDate: {
        type: Date,
        default: Date.now
    }
});

export const UserInfo_Model = mongoose.model('user_info', UserInfo_Schema);

import { Types } from "mongoose";
import { UserInfo_Model } from "../models/user_info";

export const createUserFromUsername = (values: Record<string, any>) =>
    new UserInfo_Model(values)
    .save()
    .then((user) => user.toObject());

export const getUserByUsername = (username: string) => {
    return UserInfo_Model.findOne({ username });
}

export const getUserByUserId = (id: string|Types.ObjectId) => 
    UserInfo_Model.findById(id);
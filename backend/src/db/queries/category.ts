import logger from "../../utils/logger";
import { Category_Model } from "../models/category";

export const createCategoryByName = (values: Record<string, any>) =>
    new Category_Model(values)
        .save()
        .then((cat) => cat.toObject());

export const updateCategoryById = (
    id: String,
    values: Record<string, any>
) => Category_Model.findByIdAndUpdate(id, values)


export const deleteCategoryByIds = (ids: string[]) =>
    Category_Model.deleteMany({ _id: { $in: ids } })
        .then((result) => {
            // Check result and handle success or error
            if (result.deletedCount > 0) {
                logger.debug(`Deleted ${result.deletedCount} categories.`);
            } else {
                logger.debug("No categories were deleted.");
            }
        });

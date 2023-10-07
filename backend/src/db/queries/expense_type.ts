import { ExpenseType_Model } from "../models/expense_type";

export const craeteExpanseTypeByTypeName = (values: Record<string, any>) =>
    new ExpenseType_Model(values)
        .save()
        .then((exp) => exp.toObject);

export const updateExpenseTypeById = (
    id: string,
    values: Record<string, any>
) => ExpenseType_Model.findByIdAndUpdate(id, values);
import { Types } from 'mongoose';
import { ExpanseJDebitInfo_Model } from '../models/expanse_jdebit';

export const craeteExpanseJDbitInfo = (values: Record<string, any>) =>
    new ExpanseJDebitInfo_Model(values)
        .save()
        .then((info) => info.toObject());
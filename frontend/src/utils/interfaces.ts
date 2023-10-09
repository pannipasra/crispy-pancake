export interface Transaction {
    _id: string;
    USER: string;
    TRANSFERRED_DATE: Date;
    USAGE_OR_DESTINATION: string;
    TRANSFERRED_AMOUNT_IN_JPY: number;
    DESCRIPTION: string;
    AUTHORIZATION_CODE: string;
    category: string;
    tags: string[];
    createdDate: string;
    __v: number;
}

export interface CalcualtedStatistics {
    minDate: string;
    maxDate: string;
    monthsPassed: number;
    totalExpense: number;
    averageExpensePerMonth: number;
    monthlyExpenses: {
        [key: string]: number;
    };
}

export interface ExpenseInfo {
    AUTHORIZATION_CODE: string;
    DESCRIPTION: string;
    TRANSFERRED_AMOUNT_IN_JPY: number;
    TRANSFERRED_DATE: string;
    USAGE_OR_DESTINATION: string;
    USER: string;
    createdDate: string;
    expenseType: string;
    userId: string;
    __v: number;
    _id: string;
}


export interface ApiResponseInfoRoughly {
    message: string;
    payload: {
        dateList: YYYYMM[];
    };
}

export interface YYYYMM {
    year: number;
    month: number;
}

export interface ApiResponseInfoByRangeDate {
    message: string;
    payload: {
        amountUseInJPY: number;
        expenseInfos: ExpenseInfo[]
    };
}

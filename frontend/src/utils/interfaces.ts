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

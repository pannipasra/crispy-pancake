// transactionUtils.ts
"use client";

import { Transaction, CalcualtedStatistics } from "./interfaces";


export function calculateStatistics(transactions: Transaction[]): CalcualtedStatistics | null {
    if (transactions) {
        // Calculate total expenses
        const totalExpense = transactions.reduce(
            (accumulator, transaction) => accumulator + transaction.TRANSFERRED_AMOUNT_IN_JPY,
            0
        );

        // Extract all TRANSFERRED_DATE values as Date objects
        const transferredDates: Date[] = transactions.map(transaction => new Date(transaction.TRANSFERRED_DATE));

        // Find the minimum and maximum dates
        const minDate: Date | undefined = transferredDates.reduce((min, current) => (min < current ? min : current), transferredDates[0]);
        const maxDate: Date | undefined = transferredDates.reduce((max, current) => (max > current ? max : current), transferredDates[0]);

        // Calculate the difference in months
        const monthsPassed = (maxDate.getFullYear() - minDate.getFullYear()) * 12 + (maxDate.getMonth() - minDate.getMonth());

        // Calculate monthlyExpenses each month usage;
        const monthlyExpenses = calcualteMothlyUsage(transactions, transferredDates);


        // Check if the dates are valid
        if (minDate instanceof Date && maxDate instanceof Date) {
            return {
                minDate: minDate.toISOString(),
                maxDate: maxDate.toISOString(),
                monthsPassed: monthsPassed,
                totalExpense: totalExpense,
                averageExpensePerMonth: totalExpense / monthsPassed,
                monthlyExpenses: monthlyExpenses
            };
        }
    }

    return null;
}

export function getMonthlyUsage(year: number, month: number, transactions: Transaction[]) {
    // function getMonth of javascript; jan=0 so dec = 11; but our moth refer to jan = 1 and dec = 12;

    // Extract all TRANSFERRED_DATE values as Date objects
    const transferredDates: Date[] = transactions.map(transaction => new Date(transaction.TRANSFERRED_DATE));

    let monthlyExpenses: { [key: string]: Transaction } = {};

    for (let index = 0; index < transactions.length; index++) {
        const _year = transferredDates[index].getFullYear();
        const _month = transferredDates[index].getMonth() + 1;
        if(_year === year && _month === month){
            const id = transactions[index]._id;
            monthlyExpenses[id] = transactions[index];
        }
    }

    return monthlyExpenses;
}

function calcualteMothlyUsage(transactions: Transaction[], transferredDates: Date[]) {
    // Calulate the monthly usage
    let monthlyExpenses: { [key: string]: number } = {};

    // Note: transactions and transferredDates has equal array lenght; 
    // Create transferredDates for map date in transactions
    for (let index = 0; index < transactions.length; index++) {
        const year = transferredDates[index].getFullYear();
        const month = transferredDates[index].getMonth() + 1;
        const key = `${year}-${month}`
        if (!monthlyExpenses[key]) {
            monthlyExpenses[key] = 0;
        }
        monthlyExpenses[key] += transactions[index].TRANSFERRED_AMOUNT_IN_JPY;
    }

    return monthlyExpenses;

    // element
    // {"_id":"","USER":"","TRANSFERRED_DATE":"","USAGE_OR_DESTINATION":"","TRANSFERRED_AMOUNT_IN_JPY":3855,"DESCRIPTION":"","AUTHORIZATION_CODE":"[673347]","createdDate":"","__v":0
}

"use client";

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { API_URL } from '@/utils/constant';
import { CalcualtedStatistics, Transaction } from '@/utils/interfaces';
import { calculateStatistics, getMonthlyUsage } from '@/utils/transactionUtils';

interface ApiResponse {
    message: string;
    payload: Transaction[];
}


export default function DisplayInfo() {
    const [jdebitInfos, setJDebitInfos] = useState<Transaction[]>();
    const [statistics, setStatistics] = useState<CalcualtedStatistics | null>(null); // Define a state to hold statistics
    const [eachMonthUsage, setEachMonthUsage] = useState<{ [key: string]: Transaction } | null>(null);
    const [className, setClassName] = useState<string>("btn-outline");
    // State to track the active button
    const [activeButton, setActiveButton] = useState<string>("");


    useEffect(() => {
        calculateStatisticsJDbit();
    }, [jdebitInfos])

    const handleOnClickInfosJDebit = async () => {
        try {
            console.log('handleOnClickInfosJDebit');
            const response = await axios.get<ApiResponse>(API_URL.GET_JDEBITS_INFOS, {
                withCredentials: true
            });
            const data = response.data;
            
            setJDebitInfos(data.payload)
        } catch (err) {
            console.error('Error fetching data:', err);
        }
    }

    const calculateStatisticsJDbit = () => {
        if (jdebitInfos) {
            const calculatedStatistics = calculateStatistics(jdebitInfos);
            setStatistics(calculatedStatistics);
        }
    }

    const fetchDetailsUsageSpecificMonthJDbebit = (month: string) => {
        const [yearStr, monthStr] = month.split('-');
        const year = parseInt(yearStr, 10); // Convert yearStr to an integer
        const monthNumber = parseInt(monthStr, 10); // Convert monthStr to an integer
        // Set the active button to the clicked month
        setActiveButton(month);
        if (jdebitInfos) {
            const monthlyUsage = getMonthlyUsage(year, monthNumber, jdebitInfos);
            setEachMonthUsage(monthlyUsage)
        }
    }

    return (
        <div>
            <div>DisplayInfo</div>
            <button
                className='btn btn-primary'
                onClick={handleOnClickInfosJDebit}
            >
                Get Infos (J-debit)
            </button>

            {/* Render the statistics */}
            {!!statistics && (
                <>
                    {/* <div>Minimum Date: {statistics.minDate}</div>
                    <div>Maximum Date: {statistics.maxDate}</div> */}
                    <div>Months Passed: {statistics.monthsPassed}</div>
                    <div>Total Expense: {statistics.totalExpense}</div>
                    <div>Average Expense per Month: {statistics.averageExpensePerMonth}</div>
                    <br />
                    <div>Expense each month:</div>

                    {Object.entries(statistics.monthlyExpenses).map(([month, expense]) => (
                        activeButton === month ? (
                            // Render your active button content here
                            <button
                                className={`btn btn-info btn-xs sm:btn-sm md:btn-md active`}
                                key={month}
                            >
                                {month}: {expense.toLocaleString()} JPY
                            </button>
                        ) : (
                            // Render your inactive button content here
                            <button
                                className={`btn btn-info btn-outline btn-xs sm:btn-sm md:btn-md`}
                                key={month}
                                onClick={() => fetchDetailsUsageSpecificMonthJDbebit(month)}
                            >
                                {month}: {expense.toLocaleString()} JPY
                            </button>
                        )
                    ))}

                </>
            )
            }

            {!!eachMonthUsage && (
                <div className="overflow-x-auto">
                    <table className="table table-xs">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Authorization Code</th>
                                <th>Usage or Destination</th>
                                <th>Description</th>
                                <th>Amount (JPY)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.keys(eachMonthUsage).map((key) => (
                                <tr key={key} className="hover">
                                    <td>{new Date(eachMonthUsage[key].TRANSFERRED_DATE).toDateString()}</td>
                                    <td>{eachMonthUsage[key].AUTHORIZATION_CODE}</td>
                                    <td>{eachMonthUsage[key].USAGE_OR_DESTINATION}</td>
                                    <td>{eachMonthUsage[key].DESCRIPTION}</td>
                                    <td>{eachMonthUsage[key].TRANSFERRED_AMOUNT_IN_JPY} JPY</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div >
    )
}

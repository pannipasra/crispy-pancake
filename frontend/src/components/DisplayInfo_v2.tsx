"use client";

import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { API_URL } from '@/utils/constant';
import { ApiResponseInfoByRangeDate, ApiResponseInfoRoughly, ExpenseInfo, YYYYMM } from '@/utils/interfaces';




export default function DisplayInfo_v2() {
    const [roughlyinfos, setRoughlyInfos] = useState<YYYYMM[] | null>(null);
    const [activateRangeRoughlyDate, setActiveRangeRoughlyDate] = useState<string>("");
    const [activeIndexBtnRoughlyDate, setActiveIndexBtnRoughlyDate] = useState<number | null>(null);
    const [eachMonthUsage, setEachMonthUsage] = useState<ExpenseInfo[] | null>(null);
    const [amountUseInJPY, setAmountUseInJPY] = useState(0);

    useEffect(() => {
        if (activateRangeRoughlyDate) {
            console.log('activateRangeRoughlyDate', activateRangeRoughlyDate);
            console.log('activeIndexBtnRoughlyDate', activeIndexBtnRoughlyDate);
            
            handleOnClickGetInfosYYYYMM();
        }
    }, [activateRangeRoughlyDate])

    const handleOnClickGetRoughtlyInfos = async () => {
        try {
            console.log('Fetching roughly expense information...');
            const response = await axios.get<ApiResponseInfoRoughly>(API_URL.GET_EXPENSE_INFO_ROUGHLY, {
                withCredentials: true
            });
            const data = response.data;
            const _roughlyInfos = data.payload.dateList;

            setRoughlyInfos(_roughlyInfos);
            console.log('Roughly expense information:', _roughlyInfos);

        } catch (err) {
            console.error('Error fetching data:', err);
        }
    }

    const handleOnClickGetInfosYYYYMM = async () => {
        try {
            const targetDateYM = normalizeDateString(activateRangeRoughlyDate);

            // console.log('targetDateYM', targetDateYM);

            const response = await axios.post<ApiResponseInfoByRangeDate>(
                API_URL.GET_EXPENSE_INFO_YYYYMM,
                {
                    targetDateYM
                },
                {
                    withCredentials: true,
                }
            );

            const amountUseInJPY = response.data.payload.amountUseInJPY;
            const expenseInfos = response.data.payload.expenseInfos;
            setAmountUseInJPY(amountUseInJPY);
            setEachMonthUsage(expenseInfos);
            // console.log(amountUseInJPY, expenseInfos);
        } catch (err) {
            console.error('Error fetching data:', err);
        }
    }

    const handleSetActiveButtonSelectedParams = async (year: number, month: number, index: number) => {
        setActiveRangeRoughlyDate(`${year}-${month}`);
        setActiveIndexBtnRoughlyDate(index);
    }

    function normalizeDateString(dateString: string) {
        const [year, month] = dateString.split('-');
        const normalizedMonth = month.length === 1 ? `0${month}` : month;
        return `${year}-${normalizedMonth}`;
    }

    return (
        <div>
            <div>DisplayInfo_v2</div>
            <button
                className='btn btn-primary'
                onClick={handleOnClickGetRoughtlyInfos}
            >
                Get Expense Infos
            </button>

            {!!roughlyinfos && (
                <div className='mt-5'>
                    <div>Months Passed: {roughlyinfos.length}</div>
                    <div>
                        {roughlyinfos.map((item, index) => (
                            activeIndexBtnRoughlyDate !== null && activeIndexBtnRoughlyDate === index ? (
                                <button
                                    className={`btn btn-info btn-xs sm:btn-sm md:btn-md active`}
                                    key={index}
                                >
                                    {`${item.year}-${item.month}`}
                                </button>
                            ) : (
                                <button
                                    className={`btn btn-info btn-outline btn-xs sm:btn-sm md:btn-md`}
                                    key={index}
                                    onClick={() => handleSetActiveButtonSelectedParams(item.year, item.month, index)}
                                >
                                    {`${item.year}-${item.month}`}
                                </button>
                            )

                        ))}
                    </div>
                    {!!eachMonthUsage && amountUseInJPY != 0 && (
                        <div className="mt-10">
                            <p>Amount use: {amountUseInJPY} JPY</p>
                            <table className="table table-xs mt-5">
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
                                    {eachMonthUsage.map((item, index) => (
                                        <tr key={index} className="hover">
                                            <td>{new Date(item.TRANSFERRED_DATE).toDateString()}</td>
                                            <td>{item.AUTHORIZATION_CODE}</td>
                                            <td>{item.USAGE_OR_DESTINATION}</td>
                                            <td>{item.DESCRIPTION}</td>
                                            <td>{item.TRANSFERRED_AMOUNT_IN_JPY}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

        </div >
    )
}
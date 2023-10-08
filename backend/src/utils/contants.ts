export enum HEADER_J_DEBITS_JP {
    USER = 'ご利用者',
    TRANSFERRED_DATE = 'お振替日',
    USAGE_OR_DESTINATION = 'ご利用先など',
    TRANSFERRED_AMOUNT_IN_JPY = 'お振替金額（￥）',
    DESCRIPTION = '摘要',
    AUTHORIZATION_CODE = '承認番号'
}

export enum HEADER_NORMALIZE_EN {
    USER = 'USER',
    TRANSFERRED_DATE = 'TRANSFERRED_DATE',
    USAGE_OR_DESTINATION = 'USAGE_OR_DESTINATION',
    TRANSFERRED_AMOUNT_IN_JPY = 'TRANSFERRED_AMOUNT_IN_JPY',
    DESCRIPTION = 'DESCRIPTION',
    AUTHORIZATION_CODE = 'AUTHORIZATION_CODE'
}

export enum COOKIE_CONFIGS {
    COOKIE_NAME = 'EXPENSE_APP_1111',
    LOCAL_DOMAIN = 'localhost'
}

export const TIMEZONE = "Asia/Tokyo";

export const DEFAULT_EXPENSE_TYPES = ['jdebits', 'cash']
export const DEFAULT_LIST_CATEGORY = ['Food', 'Transportation', 'Utilities', 'Entertainment', 'Healthcare'];
export const ERROR_SERVER_MSG = 'An error has ocuured in server.';


function isLeapYear(year: number) {
    // Leap years are divisible by 4, but not by 100 unless they are also divisible by 400
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

export function getNumberOfDaysInMonth(year: number, month: number) {
    switch (month) {
        case 1:
        case 3:
        case 5:
        case 7:
        case 8:
        case 10:
        case 12:
            return 31;
        case 4:
        case 6:
        case 9:
        case 11:
            return 30;
        case 2:
            return isLeapYear(year) ? 29 : 28;
        default:
            throw new Error('Invalid month');
    }
}
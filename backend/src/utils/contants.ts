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
    EXPENSE_APP_1111 = 'EXPENSE_APP_1111',
    LOCAL_DOMAIN = 'localhost'
}

export const TIMEZONE = "Asia/Tokyo";

export const DEFAULT_EXPENSE_TYPES = [ 'jdebits', 'cash' ]
export const DEFAULT_LIST_CATEGORY = [ 'Food', 'Transportation', 'Utilities', 'Entertainment', 'Healthcare' ];
export const ERROR_SERVER_MSG = 'An error has ocuured in server.';
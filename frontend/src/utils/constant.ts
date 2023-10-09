const BASE_URL = 'http://localhost:7821';
const API_VER_1 = '/api/v1';
const BASE_API_URL = BASE_URL + API_VER_1;

export enum API_URL {
    UPLOAD_FILE = `${BASE_API_URL}/file/upload-multi`,
    GET_JDEBITS_INFOS = `${BASE_API_URL}/expense_info/get-all-infos`,
    GET_EXPENSE_INFO_ROUGHLY = `${BASE_API_URL}/expense_info/get-roughly-infos`,
    GET_EXPENSE_INFO_YYYYMM = `${BASE_API_URL}/expense_info/get-roughly-infos-targetDate-yyyy-mm`,
    LOGIN = `${BASE_API_URL}/user/login`,
  }
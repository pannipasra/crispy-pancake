const BASE_URL = 'http://localhost:7821';
const API_VER_1 = '/api/v1';
const BASE_API_URL = BASE_URL + API_VER_1;

export enum API_URL {
    UPLOAD_FILE = BASE_API_URL + '/file/upload-multi',
    GET_JDEBITS_INFOS = BASE_API_URL + '/file/get-infos',
}
import axios from 'axios';
import { API_URL } from '../constants/constants';

export const FETCH_HAPPINESS = 'FETCH_HAPPINESS';
// export const GET_USER_DATA = 'GET_USER_DATA';
// export const GET_USER_DATA_SUCCESS = 'GET_USER_DATA_SUCCESS';
// export const GET_USER_DATA_FAILURE = 'GET_USER_DATA_FAILURE';


const ROOT_URL = `${API_URL}/api/v1`;


export function fetchHappiness(accessToken) {
    const request = axios({
        method: 'GET',
        url: `${ROOT_URL}/get_happiness_by_user/`,
        headers: {Authorization: `Bearer ${accessToken}`},
    });

    return {
        type: FETCH_HAPPINESS,
        payload: request,
    };
}

import axios from 'axios';
import { API_URL } from '../constants/ApiConstants';

export const FETCH_RATINGS = 'FETCH_RATINGS';
export const FETCH_RATINGS_SUCCESS = 'FETCH_RATINGS_SUCCESS';
export const FETCH_RATINGS_FAILURE = 'FETCH_RATINGS_FAILURE';

const ROOT_URL = `${API_URL}/api/v1`;

export function fetchRatings(accessToken) {
    const request = axios({
        method: 'GET',
        url: `${ROOT_URL}/ratings/`,
        headers: {Authorization: `Bearer ${accessToken}`},
    });

    return {
        type: FETCH_RATINGS,
        payload: request,
    };
}

export function fetchRatingsSuccess(results) {
    return {
        type: FETCH_RATINGS_SUCCESS,
        payload: results,
    };
}

export function fetchRatingsFailure(error) {
    return {
        type: FETCH_RATINGS_FAILURE,
        payload: error,
    };
}

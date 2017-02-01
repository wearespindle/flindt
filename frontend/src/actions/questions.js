import axios from 'axios';
import { API_URL } from '../constants/constants';

export const FETCH_QUESTION = 'FETCH_QUESTION';

const ROOT_URL = `${API_URL}/api/v1`;

export function fetchQuestion(accessToken, id) {
    const requestQuestion = axios({
        method: 'GET',
        url: `${ROOT_URL}/questions/${id}/`,
        headers: {Authorization: `Bearer ${accessToken}`},
    });

    return {
        type: FETCH_QUESTION,
        payload: requestQuestion,
    };
}

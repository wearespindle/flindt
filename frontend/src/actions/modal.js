import axios from 'axios';
import { API_URL } from '../constants/constants';

export const SHOW_MODAL = 'SHOW_MODAL';
export const HIDE_MODAL = 'HIDE_MODAL';

const ROOT_URL = `${API_URL}/api/v1`;

export function showModal(accessToken, id) {
    const request = axios({
        method: 'GET',
        url: `${ROOT_URL}/roles/${id}/`,
        headers: {Authorization: `Bearer ${accessToken}`},
    });

    return {
        type: SHOW_MODAL,
        payload: request,
    };
}

export function hideModal() {
    return {
        type: HIDE_MODAL,
    };
}

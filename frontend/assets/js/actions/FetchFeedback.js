import axios from 'axios';
import { API_URL } from '../constants/ApiConstants';

// Fetch feedback lists as sender
export const FETCH_FEEDBACK_AS_SENDER = 'FETCH_FEEDBACK_AS_SENDER';
export const FETCH_FEEDBACK_AS_SENDER_SUCCESS = 'FETCH_FEEDBACK_AS_SENDER_SUCCESS';
export const FETCH_FEEDBACK_AS_SENDER_FAILURE = 'FETCH_FEEDBACK_AS_SENDER_FAILURE';
export const RESET_FETCH_FEEDBACK_AS_SENDER = 'RESET_FETCH_FEEDBACK_AS_SENDER';

// Fetch feedback lists as receiver
export const FETCH_FEEDBACK_AS_RECEIVER = 'FETCH_FEEDBACK_AS_RECEIVER';
export const FETCH_FEEDBACK_AS_RECEIVER_SUCCESS = 'FETCH_FEEDBACK_AS_RECEIVER_SUCCESS';
export const FETCH_FEEDBACK_AS_RECEIVER_FAILURE = 'FETCH_FEEDBACK_AS_RECEIVER_FAILURE';
export const RESET_FETCH_FEEDBACK_AS_RECEIVER = 'RESET_FETCH_FEEDBACK_AS_RECEIVER';

// Fetch feedback object
export const FETCH_FEEDBACK = 'FETCH_FEEDBACK';
export const FETCH_FEEDBACK_SUCCESS = 'FETCH_FEEDBACK_SUCCESS';
export const FETCH_FEEDBACK_FAILURE = 'FETCH_FEEDBACK_FAILURE';
export const FETCH_FEEDBACK_RESET = 'FETCH_FEEDBACK_RESET';

export const EDIT_FEEDBACK = 'EDIT_FEEDBACK';
export const EDIT_FEEDBACK_SUCCESS = 'EDIT_FEEDBACK_SUCCESS';
export const EDIT_FEEDBACK_FAILURE = 'EDIT_FEEDBACK_FAILURE';

// Post new feedback
export const CREATE_FEEDBACK = 'CREATE_FEEDBACK';
export const CREATE_FEEDBACK_SUCCESS = 'CREATE_FEEDBACK_SUCCESS';
export const CREATE_FEEDBACK_FAILURE = 'CREATE_FEEDBACK_FAILURE';
export const RESET_CREATE_FEEDBACK = 'RESET_CREATE_FEEDBACK';

// Test URL to get data as a json to show in our view.
const ROOT_URL = `${API_URL}/api/v1`;

export function fetchFeedbackAsSender(accessToken) {
    const request = axios({
        method: 'GET',
        url: `${ROOT_URL}/users/feedback-as-sender/`,
        headers: {Authorization: `Bearer ${accessToken}`},
    });

    return {
        type: FETCH_FEEDBACK_AS_SENDER,
        payload: request,
    };
}

export function fetchFeedbackAsSenderSuccess(results) {
    return {
        type: FETCH_FEEDBACK_AS_SENDER_SUCCESS,
        payload: results,
    };
}

export function fetchFeedbackAsSenderFailure(error) {
    return {
        type: FETCH_FEEDBACK_AS_SENDER_FAILURE,
        payload: error,
    };
}

export function fetchFeedbackAsReceiver(accessToken) {
    const request = axios({
        method: 'GET',
        url: `${ROOT_URL}/users/feedback-as-receiver/`,
        headers: {Authorization: `Bearer ${accessToken}`},
    });

    return {
        type: FETCH_FEEDBACK_AS_RECEIVER,
        payload: request,
    };
}

export function fetchFeedbackAsReceiverSuccess(results) {
    return {
        type: FETCH_FEEDBACK_AS_RECEIVER_SUCCESS,
        payload: results,
    };
}

export function fetchFeedbackAsReceiverFailure(error) {
    return {
        type: FETCH_FEEDBACK_AS_RECEIVER_FAILURE,
        payload: error,
    };
}

export function editFeedback(props, accessToken) {
    const request = axios({
        method: 'PATCH',
        data: props,
        url: `${ROOT_URL}/feedbacks/${props.id}/`,
        headers: {Authorization: `Bearer ${accessToken}`},
    });

    return {
        type: EDIT_FEEDBACK,
        payload: request,
    };
}

export function editFeedbackSuccess(newFeedback) {
    return {
        type: EDIT_FEEDBACK_SUCCESS,
        payload: newFeedback,
    };
}

export function editFeedbackFailure(error) {
    return {
        type: EDIT_FEEDBACK_FAILURE,
        payload: error,
    };
}

export function fetchFeedback(accessToken, id) {
    const requestFeedback = axios({
        method: 'GET',
        url: `${ROOT_URL}/feedbacks/${id}/`,
        headers: {Authorization: `Bearer ${accessToken}`},
    });

    return {
        type: FETCH_FEEDBACK,
        payload: requestFeedback,
    };
}

export function fetchFeedbackSuccess(results) {
    return {
        type: FETCH_FEEDBACK_SUCCESS,
        payload: results,
    };
}

export function fetchFeedbackFailure(error) {
    return {
        type: FETCH_FEEDBACK_FAILURE,
        payload: error,
    };
}

import axios from 'axios';

export const FETCH_FEEDBACK_AS_RECEIVER = 'FETCH_FEEDBACK_AS_RECEIVER';
export const FETCH_FEEDBACK_AS_RECEIVER_SUCCESS = 'FETCH_FEEDBACK_AS_RECEIVER_SUCCESS';
export const FETCH_FEEDBACK_AS_RECEIVER_FAILURE = 'FETCH_FEEDBACK_AS_RECEIVER_FAILURE';
export const RESET_FETCH_FEEDBACK_AS_RECEIVER = 'RESET_FETCH_FEEDBACK_AS_RECEIVER';

const ROOT_URL = 'http://crossorigin.me/http://tomoffringa.nl/api/as_receiver';

export function fetchFeedbackAsReceiver() {
    const request = axios({
        method: 'get',
        url: `${ROOT_URL}/feedback.json`,
        headers: [],
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

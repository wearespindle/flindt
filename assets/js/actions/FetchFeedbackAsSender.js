import axios from 'axios';

//Post list
export const FETCH_FEEDBACK_AS_SENDER = 'FETCH_FEEDBACK_AS_SENDER';
export const FETCH_FEEDBACK_AS_SENDER_SUCCESS = 'FETCH_FEEDBACK_AS_SENDER_SUCCESS';
export const FETCH_FEEDBACK_AS_SENDER_FAILURE = 'FETCH_FEEDBACK_AS_SENDER_FAILURE';
export const RESET_FETCH_FEEDBACK_AS_SENDER = 'RESET_FETCH_FEEDBACK_AS_SENDER';

const ROOT_URL = 'http://crossorigin.me/http://tomoffringa.nl/api/as_sender';

export function fetchFeedbackAsSender() {
    const request = axios({
        method: 'get',
        url: `${ROOT_URL}/feedback.json`,
        headers: [],
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

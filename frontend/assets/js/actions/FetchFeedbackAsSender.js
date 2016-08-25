import axios from 'axios';

//Feedback lists
export const FETCH_FEEDBACK_AS_SENDER = 'FETCH_FEEDBACK_AS_SENDER';
export const FETCH_FEEDBACK_AS_SENDER_SUCCESS = 'FETCH_FEEDBACK_AS_SENDER_SUCCESS';
export const FETCH_FEEDBACK_AS_SENDER_FAILURE = 'FETCH_FEEDBACK_AS_SENDER_FAILURE';
export const RESET_FETCH_FEEDBACK_AS_SENDER = 'RESET_FETCH_FEEDBACK_AS_SENDER';


// Post new feedback
export const CREATE_FEEDBACK = 'CREATE_FEEDBACK';
export const CREATE_FEEDBACK_SUCCESS = 'CREATE_FEEDBACK_SUCCESS';
export const CREATE_FEEDBACK_FAILURE = 'CREATE_FEEDBACK_FAILURE';
export const RESET_CREATE_FEEDBACK = 'RESET_CREATE_FEEDBACK';

// Test URL to get data as a json to show in our view.
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

// Test URL to do a POST and get a returncode upon creating/saving feedback.
const POST_URL = 'http://jsonplaceholder.typicode.com/posts';

export function createFeedback(props, tokenFromStorage) {
    const index = props.postIndex;
    //const request = axios.post(`${ROOT_URL}/posts`, props);
    const request = axios({
        method: 'post',
        data: props,
        url: `${POST_URL}`,
        // headers: {'Authorization': `Bearer ${tokenFromStorage}`},
    });

    return {
        type: CREATE_FEEDBACK,
        payload: request,
    };
}

export function createFeedbackSuccess(newFeedback) {
    return {
        type: CREATE_FEEDBACK_SUCCESS,
        payload: newFeedback,
    };
}

export function createFeedbackFailure(error) {
    return {
        type: CREATE_FEEDBACK_FAILURE,
        payload: error,
    };
}

export function resetCreateFeedback() {
    return {
        type: RESET_CREATE_FEEDBACK,
    };
}

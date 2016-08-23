import {
    FETCH_FEEDBACK_AS_SENDER,
    FETCH_FEEDBACK_AS_SENDER_SUCCESS,
    FETCH_FEEDBACK_AS_SENDER_FAILURE,
    RESET_FETCH_FEEDBACK_AS_SENDER,
} from '../actions/FetchFeedbackAsSender';

const INITIAL_STATE = {
    data: {feedback: [], error: null, loading: false},
};

export default function(state = INITIAL_STATE, action) {
    let error;
    switch (action.type) {

    case FETCH_FEEDBACK_AS_SENDER:// start fetching posts and set loading = true
        return { ...state, data: {feedback: [], error: null, loading: true} };
    case FETCH_FEEDBACK_AS_SENDER_SUCCESS:// return list of posts and make loading = false
        return { ...state, data: {feedback: action.payload.data, error: null, loading: false} };
    case FETCH_FEEDBACK_AS_SENDER_FAILURE:// return error and make loading = false
        error = action.payload.data || {message: action.payload.message};//2nd one is network or server down errors
        return { ...state, data: {feedback: [], error: error, loading: false} };
    case RESET_FETCH_FEEDBACK_AS_SENDER:// reset postList to initial state
        return { ...state, data: {feedback: [], error: null, loading: false} };
    default:
        return state;
    }
}

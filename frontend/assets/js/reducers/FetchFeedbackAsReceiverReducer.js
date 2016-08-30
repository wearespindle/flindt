import {
    FETCH_FEEDBACK_AS_RECEIVER,
    FETCH_FEEDBACK_AS_RECEIVER_SUCCESS,
    FETCH_FEEDBACK_AS_RECEIVER_FAILURE,
    RESET_FETCH_FEEDBACK_AS_RECEIVER,
} from '../actions/FetchFeedbackAsReceiver';

const INITIAL_STATE = {
    data: {feedback: [], error: null, loading: false},
};

export default function(state = INITIAL_STATE, action) {
    let error;
    switch (action.type) {

    case FETCH_FEEDBACK_AS_RECEIVER:// start fetching posts and set loading = true
        return { ...state, data: {feedback: [], error: null, loading: true} };
    case FETCH_FEEDBACK_AS_RECEIVER_SUCCESS:// return list of posts and make loading = false
        return { ...state, data: {feedback: action.payload.data, error: null, loading: false} };
    case FETCH_FEEDBACK_AS_RECEIVER_FAILURE:// return error and make loading = false
        error = action.payload.data || {message: action.payload.message};
        return { ...state, data: {feedback: [], error, loading: false} };
    case RESET_FETCH_FEEDBACK_AS_RECEIVER:// reset postList to initial state
        return { ...state, data: {feedback: [], error: null, loading: false} };
    default:
        return state;
    }
}

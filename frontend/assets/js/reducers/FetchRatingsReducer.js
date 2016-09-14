import {
    FETCH_RATINGS,
    FETCH_RATINGS_SUCCESS,
    FETCH_RATINGS_FAILURE
} from '../actions/FetchRatings';

const INITIAL_STATE = {
    ratings: [],
};

export default function(state = INITIAL_STATE, action) {
    let error;
    let i;

    switch (action.type) {
        case FETCH_RATINGS:
            return { ...state, ratings: [] };
        case FETCH_RATINGS_SUCCESS:
            return { ...state, ratings: action.payload.data };
        case FETCH_RATINGS_FAILURE:
            error = action.payload.data || { message: action.payload.message };
            return { ...state};

    default:
        return state;
    }
}

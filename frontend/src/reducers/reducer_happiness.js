import {
    FETCH_HAPPINESS,
} from '../actions/happiness';

const INITIAL_STATE = {
    happiness: [],
};

export default function(state = INITIAL_STATE, action) {
    let error,
        i;

    switch (action.type) {
    case FETCH_HAPPINESS:
        return { ...state, happiness: action.payload.data };

    default:
        return state;
    }
}

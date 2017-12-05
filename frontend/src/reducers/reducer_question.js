import { FETCH_QUESTION } from '../actions/questions';

const INITIAL_STATE = {
  question: {}
};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_QUESTION:
      return { ...state, question: action.payload.data };

    default:
      return state;
  }
}

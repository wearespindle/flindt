import {
  EDIT_FEEDBACK,
  FETCH_FEEDBACK_AS_SENDER,
  FETCH_FEEDBACK_AS_RECEIVER,
  FETCH_FEEDBACK,
  CLEAN_FEEDBACK
} from '../actions/feedback';

const INITIAL_STATE = {
  feedback_as_sender: { feedback: [], loading: true, amount: 0 },
  feedback_as_receiver: { feedback: [], loading: true, amount: 0 },
  feedback: { feedback: {} }
};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_FEEDBACK_AS_SENDER:
      return {
        ...state,
        feedback_as_sender: {
          feedback: action.payload.data.results,
          loading: false,
          amount: action.payload.data.count
        }
      };

    case FETCH_FEEDBACK_AS_RECEIVER:
      return {
        ...state,
        feedback_as_receiver: {
          feedback: action.payload.data.results,
          loading: false,
          count: action.payload.data.count
        }
      };

    case FETCH_FEEDBACK:
      return { ...state, feedback: { feedback: action.payload.data } };

    case EDIT_FEEDBACK:
      return { ...state };

    case CLEAN_FEEDBACK:
      return INITIAL_STATE;

    default:
      return state;
  }
}

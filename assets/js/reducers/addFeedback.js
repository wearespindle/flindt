function addFeedback(state = [], action) {
    switch (action.type) {

    case 'SAVE_FEEDBACK_STATE':
        return Object.assign({}, state, {
            feedbackPositives: action.positives,
            feedbackImprovements: action.improvements,
        });
    case 'SAVE_FEEDBACK':
        return Object.assign({}, state, {
            feedbackPositives: action.positives,
            feedbackImprovements: action.improvements,
            personalFeedbackQuestion: action.personalFeedbackQuestion,
            personalFeedbackAnswer: action.personalFeedbackAnswer,
        });
    default:
        return state;
    }
}

export default addFeedback;

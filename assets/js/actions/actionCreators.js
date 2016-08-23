// Save feedbackState for the personal feedback object.
export function saveFeedbackState(positives, improvements) {
    return {
        type: 'SAVE_FEEDBACK_STATE',
        positives,
        improvements,
    };
}

// Save feedback to the state for later use.
export function saveFeedback(personId, positives, improvements, question, answer) {
    return {
        type: 'SAVE_FEEDBACK',
        personId,
        positives,
        improvements,
        question,
        answer,
    };
}

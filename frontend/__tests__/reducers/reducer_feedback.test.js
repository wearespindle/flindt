import feedbackReducer from '../../src/reducers/reducer_feedback';

describe('Feedback reducer', () => {
    it('Feedback reducer has default state', () => {
        expect(feedbackReducer(undefined, {type: 'unexpected'})).toEqual({
            feedback_as_sender: { feedback: [] },
            feedback_as_receiver: { feedback: [] },
            feedback: { feedback: {} },
        });
    });
});

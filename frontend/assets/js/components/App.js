import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

import { fetchFeedbackAsSender, fetchFeedbackAsSenderSuccess, fetchFeedbackAsSenderFailure,
         createFeedback, createFeedbackSuccess, createFeedbackFailure } from '../actions/FetchFeedbackAsSender';
import { fetchFeedbackAsReceiver, fetchFeedbackAsReceiverSuccess,
         fetchFeedbackAsReceiverFailure } from '../actions/FetchFeedbackAsReceiver';

import Main from './Main';

const mapStateToProps = (state) => ({
    as_sender_data: state.FetchFeedbackAsSender.data,
    as_receiver_data: state.FetchFeedbackAsReceiver.data,
});

const mapDispatchToProps = (dispatch) => ({

    fetchFeedbackAsSender: () => {
        dispatch(fetchFeedbackAsSender()).then((response) => {
            if (!response.error) {
                dispatch(fetchFeedbackAsSenderSuccess(response.payload));
            } else {
                dispatch(fetchFeedbackAsSenderFailure(response.payload));
            }
        });
    },
    fetchFeedbackAsReceiver: () => {
        dispatch(fetchFeedbackAsReceiver()).then((response) => {
            if (!response.error) {
                dispatch(fetchFeedbackAsReceiverSuccess(response.payload));
            } else {
                dispatch(fetchFeedbackAsReceiverFailure(response.payload));
            }
        });
    },
    createFeedback: (values) =>
        new Promise((resolve, reject) => {
            // if (!token || token === '') { //if there is no token, dont bother,
            //     let data = {data: {message: 'Please Sign In'}};//axios like error
            //     dispatch(createPostFailure(data)); // but let other comps know
            //     reject(data); //this is for redux-form itself
            //     return;
            // }
            dispatch(createFeedback(values))
            .then((response) => {
                let data = response.payload.data;
                if (response.payload.status !== 201 && response.payload.status !== 200) {
                    dispatch(createFeedbackFailure(response.payload));
                } else {
                    // Update the Redux state after everything is checked.
                    dispatch(createFeedbackSuccess(response.payload));
                    // Send the user back to his feedback overview after a succesful action.
                    browserHistory.push('/');
                }
            });
        }),

});


const App = connect(mapStateToProps, mapDispatchToProps)(Main);

export default App;

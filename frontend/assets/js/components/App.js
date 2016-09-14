import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

import Notifications from 'react-notification-system-redux';

import { fetchFeedbackAsSender, fetchFeedbackAsSenderSuccess, fetchFeedbackAsSenderFailure,
    fetchFeedbackAsReceiver, fetchFeedbackAsReceiverSuccess, fetchFeedbackAsReceiverFailure,
    editFeedback, editFeedbackSuccess, editFeedbackFailure,
    fetchFeedback, fetchFeedbackSuccess, fetchFeedbackFailure } from '../actions/FetchFeedback';

import { fetchRatings, fetchRatingsSuccess, fetchRatingsFailure } from '../actions/FetchRatings';

import { userLogin, userLoginSuccess, userLoginFailure, getUserData,
        getUserDataSuccess, getUserDataFailure } from '../actions/User';

import AppContainer from './AppContainer';

const mapStateToProps = (state) => ({
    as_sender_data: {
        feedback: state.FetchFeedback.feedback_as_sender.feedback,
        error: state.FetchFeedback.feedback_as_sender.error,
        loading: state.FetchFeedback.feedback_as_sender.loading,
    },
    as_receiver_data: {
        feedback: state.FetchFeedback.feedback_as_receiver.feedback,
        error: state.FetchFeedback.feedback_as_receiver.error,
        loading: state.FetchFeedback.feedback_as_receiver.loading,
    },
    feedback: {
        feedback: state.FetchFeedback.feedback.feedback,
        error: state.FetchFeedback.feedback.error,
        loading: state.FetchFeedback.feedback.loading,
    },
    user: state.User.data,
    user_data: state.User.user_data,
    ratings: state.FetchRatings.ratings,
    Notifications: state.Notifications,
});

const mapDispatchToProps = (dispatch) => ({

    fetchFeedbackAsSender: (accessToken) => {
        dispatch(fetchFeedbackAsSender(accessToken)).then((response) => {
            if (!response.error) {
                dispatch(fetchFeedbackAsSenderSuccess(response.payload));
            } else {
                dispatch(fetchFeedbackAsSenderFailure(response.payload));

                dispatch(Notifications.error({
                    title: 'Error! 😱😪',
                    message: 'Er ging iets fout bij het ophalen van de feedback.',
                    position: 'tr',
                    autoDismiss: 4,
                }));
            }
        });
    },
    fetchFeedbackAsReceiver: (accessToken) => {
        dispatch(fetchFeedbackAsReceiver(accessToken)).then((response) => {
            if (!response.error) {
                dispatch(fetchFeedbackAsReceiverSuccess(response.payload));
            } else {
                dispatch(fetchFeedbackAsReceiverFailure(response.payload));

                dispatch(Notifications.error({
                    title: 'Error! 😱😪',
                    message: 'Er ging iets fout bij het ophalen van de feedback.',
                    position: 'tr',
                    autoDismiss: 4,
                }));
            }
        });
    },
    fetchFeedback: (accessToken, id) => {
        dispatch(fetchFeedback(accessToken, id)).then((response) => {
            if (!response.error) {
                dispatch(fetchFeedbackSuccess(response.payload));
            } else {
                dispatch(fetchFeedbackFailure(response.payload));

                dispatch(Notifications.error({
                    title: 'Error! 😱😪',
                    message: 'Er ging iets fout bij het ophalen van de feedback.',
                    position: 'tr',
                    autoDismiss: 4,
                }));
            }
        });
    },

    editFeedback: (values, accessToken) =>
        new Promise((resolve, reject) => {
            dispatch(editFeedback(values, accessToken))
            .then((response) => {
                let data = response.payload.data;
                if (response.payload.status !== 200) {
                    dispatch(editFeedbackFailure(response.payload));

                    dispatch(Notifications.error({
                        title: 'Error! 😱😪',
                        message: 'Er ging iets fout bij het opslaan',
                        position: 'tr',
                        autoDismiss: 4,
                    }));
                } else {
                    // Update the Redux state after everything is checked.
                    dispatch(editFeedbackSuccess(response.payload));

                    dispatch(Notifications.success({
                        title: 'Succes! 💪🏼😁',
                        message: 'Je gegevens zijn succesvol verwerkt! Thanks!',
                        position: 'tr',
                        autoDismiss: 4,
                    }));

                    // Send the user back to his feedback overview after a succesful action.
                    browserHistory.push('/');
                }
            });
        }),

    fetchRatings: (accessToken) => {
        dispatch(fetchRatings(accessToken)).then((response) => {
            if (!response.error) {
                dispatch(fetchRatingsSuccess(response.payload));
            } else {
                dispatch(fetchRatingsFailure(response.payload));

                dispatch(Notifications.error({
                    title: 'Error! 😱😪',
                    message: 'Er ging iets fout bij het ophalen van de data.',
                    position: 'tr',
                    autoDismiss: 4,
                }));
            }
        });
    },

    getBackendAccessToken: (googleToken) =>
        new Promise((resolve, reject) => {
            dispatch(userLogin(googleToken))
            .then((response) => {
                let data = response.payload.data;
                if (response.payload.status !== 200) {
                    dispatch(userLoginFailure(response.payload.response));
                } else {
                    dispatch(userLoginSuccess(data));

                    dispatch(getUserData(data.access_token))
                    .then((usermeta) => {
                        if (usermeta.payload.status !== 200) {
                            dispatch(getUserDataFailure(response.payload.response));
                        } else {
                            dispatch(getUserDataSuccess(usermeta.payload.data[0]));
                        }
                    });
                }
            });
        }),
});


const App = connect(mapStateToProps, mapDispatchToProps)(AppContainer);

export default App;

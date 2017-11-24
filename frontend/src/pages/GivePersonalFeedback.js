import _ from 'lodash';
import propTypes from 'prop-types';
import React, { Component } from 'react';
import { reduxForm, Field, SubmissionError, getFormValues } from 'redux-form';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Notifications from 'react-notification-system-redux';

import Header from '../components/header';

import { cleanFeedback, editFeedback, fetchFeedback } from '../actions/feedback';

// renderField component for reduxForms.
const renderField = ({ input, meta: { touched, error } }) => (
    <div>
        <textarea {...input} />
        {touched && error && <span className="label--alert">{error}</span>}
    </div>
);

renderField.propTypes = {
    input: propTypes.object,
    meta: propTypes.object,
};


// Assign this class to a variable to 'connect' both reduxForm and redux without
// ESLint throwing a `no-class-assign`-error.
let GivePersonalFeedbackClass = class GivePersonalFeedback extends Component {
    constructor(props) {
        super(props);

        this._handleSubmit = this._handleSubmit.bind(this);

        this.state = {
            id: this.props.params.feedbackId,
            answer: '',
        };
    }

    componentWillMount() {
        let accessToken = this.props.user.user.access_token;

        this.props.fetchFeedback(accessToken, this.props.params.feedbackId);
    }

    componentWillUnmount() {
        this.props.cleanFeedback();
    }

    _handleSubmit(values) {
        const { id } = this.state;

        let accessToken = this.props.user.user.access_token;
        let answer = values.personalFeedbackQuestion;

        this.props.editFeedback({
            id,
            status: 1,
            individual: {answer},
        }, accessToken).then((response) => {
            let data = response.payload.data;

            if (response.payload.status !== 200) {
                this.props.dispatch(Notifications.error({
                    title: 'Error!',
                    message: 'Something went wrong while saving the data!',
                    position: 'tr',
                    autoDismiss: 2,
                }));
            } else {
                this.props.dispatch(Notifications.success({
                    title: 'Sweet success!',
                    message: 'Feedback succesfully saved! Thanks!',
                    position: 'tr',
                    autoDismiss: 2,
                }));

                // Send the user back to his feedback overview after a succesful action.
                this.context.router.push('/give-feedback/');
            }
        });
    }

    render() {
        const { feedback } = this.props.feedback;

        if (!Object.keys(feedback).length) {
            return (
                <div className="content--wrapper">
                    <div className="content--header">
                        <Header />
                        <div className="content--header-breadcrumbs">
                            <ul>
                                <li>Give feedback</li>
                                <li>Personal feedback</li>
                            </ul>
                        </div>
                    </div>

                    <div className="content">
                        <h2>Feedback on person</h2>

                        <div className="feedback-form--wrapper">
                            <div className="spinner">
                                <div className="bounce1" />
                                <div className="bounce2" />
                                <div className="bounce3" />
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        let person = feedback.recipient;
        const { handleSubmit } = this.props;

        return (
            <div className="content--wrapper">
                <div className="content--header">
                    <Header />
                    <div className="content--header-breadcrumbs">
                        <ul>
                            <li>Give feedback</li>
                            <li>Personal feedback</li>
                        </ul>
                    </div>
                </div>

                <div className="content">
                    <h2>Feedback on person</h2>

                    <div className="feedback-form--wrapper">
                        <table className="feedback-form--meta">
                            <thead>
                                <tr>
                                    <th>Person</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td data-label="Person">
                                        {person.first_name} {person.last_name}
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        <div className="feedback-form--row padding-bottom-0">
                            <div className="feedback-form--form">
                                <form onSubmit={handleSubmit(this._handleSubmit)}>
                                    <div className="feedback-form--answer-container">
                                        <label htmlFor="personalFeedbackQuestion">
                                            <strong>{ feedback.individual.question.content }</strong>
                                        </label>
                                        <Field name="personalFeedbackQuestion" component={renderField} />
                                    </div>

                                    <Link to="/give-feedback" className="action--button neutral">
                                        <i className="fa fa-chevron-left" /> Back to overview
                                    </Link>
                                    <button className="action--button is-right" type="submit">Save</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};

// reduxForm validate function.
function validate(values) {
    const errors = {};

    if (!values.personalFeedbackQuestion) {
        errors.personalFeedbackQuestion = 'Please fill in an answer';
    }

    return errors;
}

// Redux functions to map state and dispatch to props.
const mapStateToProps = (state) => ({
    feedback: state.Feedback.feedback,
    user: state.User.data,
});

GivePersonalFeedbackClass.propTypes = {
    cleanFeedback: propTypes.func,
    dispatch: propTypes.func,
    editFeedback: propTypes.func,
    feedback: propTypes.object,
    fetchFeedback: propTypes.func,
    handleSubmit: propTypes.func,
    params: propTypes.object,
    user: propTypes.object,
};

GivePersonalFeedbackClass.contextTypes = {
    router: propTypes.object,
};

// Connect reduxForm to our class.
GivePersonalFeedbackClass = reduxForm({
    form: 'GivePersonalFeedbackForm',
    validate,
})(GivePersonalFeedbackClass);

export default connect(mapStateToProps, {cleanFeedback, editFeedback, fetchFeedback})(GivePersonalFeedbackClass);

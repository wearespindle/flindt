import _ from 'lodash';
import React, { Component } from 'react';
import { reduxForm, Field, SubmissionError, getFormValues } from 'redux-form';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Notifications from 'react-notification-system-redux';

import { fetchFeedback, editFeedback } from '../actions/feedback';
import { fetchQuestion } from '../actions/questions';

// renderField component for reduxForms.
const renderField = ({ input, meta: { touched, error } }) => (
    <div>
        <textarea {...input} />
        {touched && error && <span className="label--alert">{error}</span>}
    </div>
);

renderField.propTypes = {
    input: React.PropTypes.object,
    meta: React.PropTypes.object,
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

        this.props.fetchFeedback(accessToken, this.props.params.feedbackId).then((response) => {
            this.props.fetchQuestion(accessToken, response.payload.data.individual.question);
        });
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
                    autoDismiss: 4,
                }));
            } else {
                this.props.dispatch(Notifications.success({
                    title: 'Sweet success!',
                    message: 'Feedback succesfully saved! Thanks!',
                    position: 'tr',
                    autoDismiss: 4,
                }));

                // Send the user back to his feedback overview after a succesful action.
                this.context.router.push('/give-feedback/');
            }
        });
    }

    render() {
        const { feedback } = this.props.feedback;

        if (!feedback.recipient) {
            return (
                <div className="content--wrapper">
                    <div className="content--header">
                        <div className="content--header-spacing" />
                        <div className="content--header-breadcrumbs">
                            <ul>
                                <li>Give feedback</li>
                                <li>Feedback on person</li>
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
        const { handleSubmit, question } = this.props;

        return (
            <div className="content--wrapper">
                <div className="content--header">
                    <div className="content--header-spacing" />
                    <div className="content--header-breadcrumbs">
                        <ul>
                            <li>Give feedback</li>
                            <li>Feedback on person</li>
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
                                            { question.question.content }
                                        </label>
                                        <Field name="personalFeedbackQuestion" component={renderField} />
                                    </div>

                                    <Link to="/" className="action--button neutral">
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
    question: state.Question,
});

function mapDispatchToProps(dispatch) {
    return bindActionCreators({fetchFeedback, editFeedback, fetchQuestion}, dispatch);
}


GivePersonalFeedbackClass.propTypes = {
    dispatch: React.PropTypes.func,
    editFeedback: React.PropTypes.func,
    feedback: React.PropTypes.object,
    fetchFeedback: React.PropTypes.func,
    fetchQuestion: React.PropTypes.func,
    handleSubmit: React.PropTypes.func,
    params: React.PropTypes.object,
    user: React.PropTypes.object,
    question: React.PropTypes.object,
};

GivePersonalFeedbackClass.contextTypes = {
    router: React.PropTypes.object,
};

// Connect reduxForm to our class.
GivePersonalFeedbackClass = reduxForm({
    form: 'GivePersonalFeedbackForm',
    validate,
})(GivePersonalFeedbackClass);

export default connect(mapStateToProps, mapDispatchToProps)(GivePersonalFeedbackClass);

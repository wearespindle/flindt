import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { reduxForm, Field, SubmissionError, getFormValues } from 'redux-form';

import Notifications from 'react-notification-system-redux';

import { cleanFeedback, editFeedback, fetchFeedback } from '../actions/feedback';

// renderField component for reduxForms.
const renderTextArea = ({ input, meta: { touched, error } }) => (
    <div>
        <textarea {...input} />
        {touched && error && <span className="label--alert">{error}</span>}
    </div>
);

renderTextArea.propTypes = {
    input: React.PropTypes.object,
    meta: React.PropTypes.object,
};

let EditGivenPersonalFeedbackClass = class EditGivenPersonalFeedback extends React.Component {
    constructor(props) {
        super(props);

        this._handleSubmit = this._handleSubmit.bind(this);

        this.state = {
            id: this.props.params.feedbackId,
        };
    }

    componentWillMount() {
        let accessToken = this.props.user.user.access_token;

        this.props.fetchFeedback(accessToken, this.props.params.feedbackId).then((response) => {
            this.props.change('personalFeedbackQuestion', response.payload.data.individual.answer);
        });
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
                    message: 'Your edited feedback is succesfully saved! Thanks!',
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
                        <div className="content--header-spacing" />
                        <div className="content--header-breadcrumbs">
                            <ul>
                                <li>Check feedback</li>
                                <li>Edit Personal feedback</li>
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
                    <div className="content--header-spacing" />
                    <div className="content--header-breadcrumbs">
                        <ul>
                            <li>Check feedback</li>
                            <li>Edit Personal feedback</li>
                        </ul>
                    </div>
                </div>

                <div className="content">
                    <h2>Feedback on { person.first_name }</h2>

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
                                        { person.first_name } { person.last_name}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div className="feedback-form--row padding-bottom-0">
                            <div className="feedback-form--form">
                                <form onSubmit={handleSubmit(this._handleSubmit)}>
                                    <div className="feedback-form--answer-container">
                                        <label htmlFor="personalFeedbackQuestion">
                                            { feedback.individual.question.content }
                                        </label>
                                        <Field name="personalFeedbackQuestion" component={renderTextArea} />
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

const mapStateToProps = (state) => ({
    feedback: state.Feedback.feedback,
    user: state.User.data,
    user_data: state.User.user_data,
    question: state.Question,
});


// reduxForm validate function.
function validate(values) {
    const errors = {};

    if (!values.personalFeedbackQuestion) {
        errors.personalFeedbackQuestion = 'Please fill in an answer';
    }

    return errors;
}

EditGivenPersonalFeedbackClass.propTypes = {
    change: React.PropTypes.func,
    cleanFeedback: React.PropTypes.func,
    dispatch: React.PropTypes.func,
    editFeedback: React.PropTypes.func,
    feedback: React.PropTypes.object,
    fetchFeedback: React.PropTypes.func,
    handleSubmit: React.PropTypes.func,
    user: React.PropTypes.object,
    params: React.PropTypes.object,
};

EditGivenPersonalFeedbackClass.contextTypes = {
    router: React.PropTypes.object,
};

// Connect reduxForm to our class.
EditGivenPersonalFeedbackClass = reduxForm({
    form: 'GivePersonalFeedbackForm',
    validate,
})(EditGivenPersonalFeedbackClass);

export default connect(mapStateToProps, {cleanFeedback, fetchFeedback, editFeedback})(EditGivenPersonalFeedbackClass);

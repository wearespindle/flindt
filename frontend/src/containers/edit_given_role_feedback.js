import React from 'react';
import { Link } from 'react-router';
import Time from 'react-time';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { reduxForm, Field, SubmissionError } from 'redux-form';

import Notifications from 'react-notification-system-redux';

import ModalButton from '../components/modal_button';

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

let EditGivenRoleFeedbackClass = class EditGivenRoleFeedback extends React.Component {
    constructor(props) {
        super(props);

        this._handleSubmit = this._handleSubmit.bind(this);

        this.state = {
            id: this.props.params.feedbackId,
        };
    }

    componentWillMount() {
        let accessToken = this.props.user.user.access_token;

        // Get feedback and set default values after promises return succesfully.
        this.props.fetchFeedback(accessToken, this.props.params.feedbackId).then((response) => {
            if (response.payload.status === 200) {
                response.payload.data.role.remarks.map((remark, index) => {
                    const { rating } = remark;

                    if (rating.name.toLowerCase() === 'positives') {
                        this.props.change('positiveFeedback', response.payload.data.role.remarks[index].content);
                    } else {
                        this.props.change('improvementFeedback', response.payload.data.role.remarks[index].content);
                    }
                    // // Map function expects a return.
                    return null;
                });
            }
        });
    }

    componentWillUnmount() {
        this.props.cleanFeedback();
    }

    _handleSubmit(values) {
        const { id } = this.state;
        let remarks = this.props.feedback.feedback.role.remarks;
        let accessToken = this.props.user.user.access_token;

        // Loop through remarks and set the content for the values.
        remarks.map((remark, index) => {
            remarks[index].content = Object.values(values)[index];
            return null;
        });

        this.props.editFeedback({
            id,
            status: 1,
            role: {remarks},
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
        const { handleSubmit } = this.props;
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
        let role = feedback.role.role;
        const remarks = feedback.role.remarks;
        const accessToken = this.props.user.user.access_token;

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
                                    <th>Role</th>
                                    <th>Subcircle</th>
                                    <th>Circle</th>
                                    <th>Received on</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td data-label="Person">
                                        { person.first_name } { person.last_name}
                                    </td>
                                    <td data-label="Role">
                                        <ModalButton accessToken={accessToken} role={role.id}>
                                            { role.name }
                                        </ModalButton>
                                    </td>
                                    <td data-label="Subcircle">
                                        <ModalButton accessToken={accessToken} role={role.parent.id}>
                                            { role.parent.name }
                                        </ModalButton>
                                    </td>
                                    <td data-label="Circle">
                                        Devhouse Spindle
                                    </td>
                                    <td data-label="Received on">
                                        <Time value={feedback.date} locale="EN" format="D MMMM YYYY" />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div className="feedback-form--row padding-bottom-0">
                            <div className="feedback-form--form">
                                <form onSubmit={handleSubmit(this._handleSubmit)}>
                                    {
                                        remarks.map((remark) => {
                                            let value = '';
                                            const { rating } = remark;

                                            if (rating.name.toLowerCase() === 'positives') {
                                                return (
                                                    <div key={rating.id} className="feedback-form--row">
                                                        <div className="l-5 feedback-form--row-smiley">
                                                            <img
                                                              src="/dist/images/positive-feedback.png"
                                                              alt="Positive feedback"
                                                            />
                                                        </div>

                                                        <div className="l-43">
                                                            <label htmlFor="positiveFeedback">
                                                                {rating.description}
                                                                <span className="is-required">*</span>
                                                            </label>
                                                            <Field
                                                              name="positiveFeedback"
                                                              component={renderTextArea}
                                                            />
                                                        </div>
                                                    </div>
                                                );
                                            }

                                            return (
                                                <div key={rating.id} className="feedback-form--row">
                                                    <div className="l-5 feedback-form--row-smiley">
                                                        <img
                                                          src="/dist/images/negative-feedback.png"
                                                          alt="Improvement feedback"
                                                        />
                                                    </div>

                                                    <div className="l-43">
                                                        <label htmlFor="improvementFeedback">
                                                            {rating.description}
                                                        </label>
                                                        <Field
                                                          name="improvementFeedback"
                                                          component={renderTextArea}
                                                        />
                                                    </div>
                                                </div>
                                            );
                                        })
                                    }

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
});

// reduxForm validate function.
function validate(values) {
    const errors = {};

    if (!values.positiveFeedback) {
        errors.positiveFeedback = 'Please try to fill in some positive feedback';
    }

    if (!values.improvementFeedback) {
        errors.improvementFeedback = 'Please try to fill in some improvements or note you don\'t have any';
    }

    return errors;
}

EditGivenRoleFeedbackClass.propTypes = {
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

EditGivenRoleFeedbackClass.contextTypes = {
    router: React.PropTypes.object,
};

// Connect reduxForm to our class.
EditGivenRoleFeedbackClass = reduxForm({
    form: 'EditRoleFeedbackForm',
    validate,
})(EditGivenRoleFeedbackClass);

export default connect(mapStateToProps, {cleanFeedback, fetchFeedback, editFeedback})(EditGivenRoleFeedbackClass);

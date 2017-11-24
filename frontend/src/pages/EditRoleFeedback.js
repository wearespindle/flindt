import React from 'react';
import propTypes from 'prop-types';
import { Link } from 'react-router';
import Time from 'react-time';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { reduxForm, Field, SubmissionError } from 'redux-form';
import Notifications from 'react-notification-system-redux';
import RoleModalButton from '../components/RoleModalButton';
import Header from '../components/Header';
import { cleanFeedback, editFeedback, fetchFeedback } from '../actions/feedback';

// renderField component for reduxForms.
const renderTextArea = ({ input, meta: { touched, error } }) => (
  <div>
    <textarea {...input} required />
    {touched && error && <span className="label--alert">{error}</span>}
  </div>
);

renderTextArea.propTypes = {
  input: propTypes.object,
  meta: propTypes.object
};

let EditRoleFeedbackClass = class EditRoleFeedback extends React.Component {
  constructor(props) {
    super(props);

    this._handleSubmit = this._handleSubmit.bind(this);

    this.state = {
      id: this.props.params.feedbackId
    };
  }

  componentWillMount() {
    let accessToken = this.props.user.user.access_token;

    // Get feedback and set default values after promises return succesfully.
    this.props.fetchFeedback(accessToken, this.props.params.feedbackId).then(response => {
      if (!response.error) {
        response.payload.data.role.remarks.map((remark, index) => {
          const { rating } = remark;

          this.props.change(rating.name, remark.content);

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

    this.props
      .editFeedback(
        {
          id,
          status: 1,
          role: { remarks }
        },
        accessToken
      )
      .then(response => {
        if (response.error) {
          this.props.dispatch(
            Notifications.error({
              title: 'Error!',
              message: 'Something went wrong while saving the data!',
              position: 'tr',
              autoDismiss: 2
            })
          );
        } else {
          this.props.dispatch(
            Notifications.success({
              title: 'Sweet success!',
              message: 'Your edited feedback is succesfully saved! Thanks!',
              position: 'tr',
              autoDismiss: 2
            })
          );

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
            <Header />
            <div className="content--header-breadcrumbs">
              <ul>
                <li>Edit feedback</li>
                <li>Feedback on role</li>
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
          <Header />
          <div className="content--header-breadcrumbs">
            <ul>
              <li>Edit feedback</li>
              <li>Feedback on role</li>
            </ul>
          </div>
        </div>

        <div className="content">
          <h2>Feedback on {person.first_name}</h2>

          <div className="feedback-form--wrapper">
            <table className="feedback-form--meta">
              <thead>
                <tr>
                  <th>Person</th>
                  <th>Role</th>
                  <th>Circle</th>
                  <th>Edited on</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td data-label="Person">
                    {person.first_name} {person.last_name}
                  </td>
                  <td data-label="Role">
                    <RoleModalButton accessToken={accessToken} role={role.id}>
                      {role.name}
                    </RoleModalButton>
                  </td>
                  <td data-label="Circle">
                    {role.parent && (
                      <RoleModalButton accessToken={accessToken} role={role.parent.id}>
                        {role.parent.name}
                      </RoleModalButton>
                    )}
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
                  {remarks.map(remark => {
                    let value = '';
                    const { rating } = remark;

                    return (
                      <div key={rating.id} className="feedback-form--row">
                        {rating.image && (
                          <div className="l-5 feedback-form--row-smiley">
                            <img alt="Rating" src={rating.image} />
                          </div>
                        )}

                        <div className={rating.image ? 'l-43' : ''}>
                          <label htmlFor={rating.name}>
                            <strong>{rating.description}</strong>
                          </label>
                          <Field name={rating.name} component={renderTextArea} />
                        </div>
                      </div>
                    );
                  })}

                  <Link to="/give-feedback" className="action--button neutral">
                    <i className="fa fa-chevron-left" /> Back to overview
                  </Link>
                  <button className="action--button is-right" type="submit">
                    Save
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

const mapStateToProps = state => ({
  feedback: state.Feedback.feedback,
  user: state.User.data,
  user_data: state.User.user_data
});

// reduxForm validate function.
function validate(values) {
  const errors = {};

  // if (!values.positiveFeedback) {
  //     errors.positiveFeedback = 'Please try to fill in some positive feedback';
  // }
  //
  // if (!values.improvementFeedback) {
  //     errors.improvementFeedback = 'Please try to fill in some improvements or note you don\'t have any';
  // }

  return errors;
}

EditRoleFeedbackClass.propTypes = {
  change: propTypes.func,
  cleanFeedback: propTypes.func,
  dispatch: propTypes.func,
  editFeedback: propTypes.func,
  feedback: propTypes.object,
  fetchFeedback: propTypes.func,
  handleSubmit: propTypes.func,
  user: propTypes.object,
  params: propTypes.object
};

EditRoleFeedbackClass.contextTypes = {
  router: propTypes.object
};

// Connect reduxForm to our class.
EditRoleFeedbackClass = reduxForm({
  form: 'EditRoleFeedbackForm',
  validate
})(EditRoleFeedbackClass);

export default connect(mapStateToProps, { cleanFeedback, fetchFeedback, editFeedback })(EditRoleFeedbackClass);

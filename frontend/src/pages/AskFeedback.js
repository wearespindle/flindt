import propTypes from 'prop-types';
import React, { Component, Fragment } from 'react';
import { Field, reduxForm } from 'redux-form';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { API_URL } from '../constants/constants';

import Notifications from 'react-notification-system-redux';

import history from '../utils/history';

import Header from '../components/header';

import { askFeedback } from '../actions/feedback';

function disableFirstOption(node) {
  node.querySelector('option').disabled = true;
}

// reduxForm validate function.
function validate(values) {
  const errors = {};

  ['role', 'person', 'circle'].forEach(identifier => {
    if (!(identifier in values)) {
      errors[identifier] = `Please select a ${identifier} from the list`;
    }
  });

  return errors;
}

// renderSelect component for reduxForms.
const renderSelect = ({
  options,
  input,
  label,
  disabled,
  meta: { touched, error }
}) => (
  <Fragment>
    <select {...input} disabled={disabled}>
      <option value="">Select a {label}</option>
      {options.map(option => (
        <option key={option.id} value={option.id}>
          {option.text}
        </option>
      ))}
    </select>
    {touched && error && <span>{error}</span>}
  </Fragment>
);

renderSelect.propTypes = {
  input: propTypes.object,
  meta: propTypes.object
};

// Assign this class to a variable to 'connect' both reduxForm and redux without
// ESLint throwing a `no-class-assign`-error.
class AskFeedback extends Component {
  constructor(props) {
    super(props);

    this.state = {
      disabled: false,
      circles: [],
      roles: [],
      persons: []
    };
  }

  componentDidMount() {
    this.load({ path: 'circles' });
  }

  load = ({ path, type = path, circleId }) => {
    const { access_token } = this.props.user.user;

    return fetch(
      `${API_URL}/api/v1/feedback/ask/${path}/${
        typeof circleId !== 'undefined' ? `${circleId}/` : ''
      }`,
      {
        headers: { Authorization: `Bearer ${access_token}` }
      }
    )
      .then(r => r.json())
      .then(response => {
        this.setState({
          [type]: response[type].map(item => ({
            id: item.id || item.id,
            text: item.name
          }))
        });
      })
      .catch(err => {
        this.setState({
          [type]: []
        });
      });
  };

  circleHandler = ({ target }, value) => {
    disableFirstOption(target);

    this.setState({
      roles: [],
      persons: []
    });

    this.load({ path: 'roles', circleId: value });
    this.load({ path: 'person', type: 'persons', circleId: value });
  };

  genericHandler = ({ target }) => {
    disableFirstOption(target);
  };

  _handleSubmit = values => {
    // debugger;
    let accessToken = this.props.user.user.access_token;
    let feedbackFromPersonId = values.person;
    let feedbackOnRoleId = values.role;
    this.props
      .askFeedback(
        {
          feedbackFromPersonId,
          feedbackOnRoleId
        },
        accessToken
      )
      .then(response => {
        if (response.payload.status !== 200) {
          this.props.dispatch(
            Notifications.error({
              title: 'Error!',
              message: 'Something went wrong while asking for feedback!',
              position: 'tr',
              autoDismiss: 2
            })
          );
        } else {
          this.props.dispatch(
            Notifications.success({
              title: 'Sweet success!',
              message: 'Your request is succesfully send. Please be patient!',
              position: 'tr',
              autoDismiss: 2
            })
          );

          // Send the user back to his feedback overview after a succesful action.
          history.push('/received-feedback');
        }
      });
  };

  render() {
    const { handleSubmit } = this.props;
    const { disabled, persons, circles, roles } = this.state;

    return (
      <div className="content--wrapper">
        <div className="content--header">
          <Header />
          <div className="content--header-breadcrumbs">
            <ul>
              <li>Ask role feedback</li>
            </ul>
          </div>
        </div>

        <div className="content">
          <h2>Ask feedback</h2>

          <div className="feedback-form--wrapper">
            <div className="feedback-form--row padding-bottom-0">
              <div className="feedback-form--form">
                <form onSubmit={handleSubmit(this._handleSubmit)}>
                  <div className="feedback-form--answer-container">
                    <label>
                      <strong>I would like ask feedback in the circle</strong>

                      <Field
                        name="circle"
                        label="circle"
                        options={circles}
                        component={renderSelect}
                        disabled={circles.length === 0 || disabled}
                        onChange={this.circleHandler}
                      />
                    </label>
                  </div>

                  <div className="feedback-form--answer-container">
                    <label>
                      <strong>on my role</strong>

                      <Field
                        name="role"
                        label="role"
                        options={roles}
                        component={renderSelect}
                        disabled={roles.length === 0 || disabled}
                        onChange={this.genericHandler}
                      />
                    </label>
                  </div>

                  <div className="feedback-form--answer-container">
                    <label>
                      <strong>
                        And would like this person to give me feedback
                      </strong>

                      <Field
                        name="person"
                        label="person"
                        options={persons}
                        component={renderSelect}
                        disabled={persons.length === 0 || disabled}
                        onChange={this.genericHandler}
                      />
                    </label>
                  </div>

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
}

// Redux functions to map state and dispatch to props.
const mapStateToProps = state => ({
  feedback: state.Feedback.feedback,
  user: state.User.data
});

AskFeedback.propTypes = {
  askFeedback: propTypes.func,
  dispatch: propTypes.func,
  feedback: propTypes.object,
  handleSubmit: propTypes.func,
  params: propTypes.object,
  user: propTypes.object
};

AskFeedback.contextTypes = {
  router: propTypes.object
};

// Connect reduxForm to our class.
const form = reduxForm({
  form: 'AskFeedbackForm',
  validate
})(AskFeedback);

export default connect(mapStateToProps, {
  askFeedback
})(form);

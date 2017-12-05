import React, { Component } from 'react';
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  userLogin,
  userLoginFailure,
  userLoginSuccess,
  getUserData,
  getUserDataFailure,
  getUserDataSuccess
} from '../actions/user';
import logo from '../assets/images/logo.svg';
import signinButton from '../assets/images/google.png';
import { setupLogin } from '../authorisation/google';

class Login extends Component {
  componentDidMount() {
    const {
      userLogin,
      userLoginFailure,
      userLoginSuccess,
      getUserDataFailure,
      getUserData,
      getUserDataSuccess
    } = this.props;

    setupLogin({
      userLogin,
      userLoginFailure,
      userLoginSuccess,
      getUserDataFailure,
      getUserData,
      getUserDataSuccess
    });
  }

  render() {
    const { error } = this.props.user;

    return (
      <div className="content--wrapper full--width">
        <div className="l-container">
          <div className="login--wrapper">
            <img className="login--logo" src={logo} alt="Flindt" />
            <p>Use the button below to sign in with your Google account.</p>

            {error && (
              <div className="label--alert">
                The following error returned: {error} 😪
              </div>
            )}

            <hr />

            <a id="google-plus-signin-button" className="login--google">
              <img src={signinButton} alt="Login with Google" />
              Sign in with Google
              <i className="fa fa-chevron-right" />
            </a>
          </div>
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  user: propTypes.object
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      userLogin,
      userLoginFailure,
      userLoginSuccess,
      getUserData,
      getUserDataSuccess,
      getUserDataFailure
    },
    dispatch
  );
}

const mapStateToProps = state => ({
  user: state.User.data
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);

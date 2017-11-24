import React, { Component } from 'react';
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import loadScript from '../utils/loadScript';
import { client_id } from '../../config/google.json';

class Login extends Component {
  componentWillMount() {
    loadScript('https://apis.google.com/js/api:client.js')
      .then(this.initLogin)
      .catch(this.initLogin);

    this.setState({ loading: false });
  }

  onSuccess = googleUser => {
    this.setState({ loading: true });
    window.location.hash = '/';
  };

  initLogin = () => {
    const { gapi } = window;

    gapi.load('auth2', () => {
      gapi.auth2
        .init({ client_id, scope: 'email' })
        .then(() => {
          auth2.attachClickHandler('google-plus-signin-button', {}, this.onSuccess);
        })
        .catch(console.error);
    });
  };

  render() {
    if (this.state.loading) {
      return (
        <div className="spinner">
          <div className="bounce1" />
          <div className="bounce2" />
          <div className="bounce3" />
        </div>
      );
    }

    const { error } = this.props.user;

    return (
      <div className="l-container">
        <div className="login--wrapper">
          <img className="login--logo" src="/dist/images/logo.svg" alt="Flindt" />
          <p>Use the button below to sign in with your Google account.</p>

          {error && <div className="label--alert">The following error returned: {error} 😪</div>}

          <hr />

          <a id="google-plus-signin-button" className="login--google">
            <img src="/dist/images/google.png" alt="Login with Google" />
            Sign in with Google
            <i className="fa fa-chevron-right" />
          </a>
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  user: propTypes.object
};

const mapStateToProps = state => ({
  user: state.User.data
});

export default connect(mapStateToProps)(Login);

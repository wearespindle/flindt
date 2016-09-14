/*
  Login
  <Login/>
*/

import React from 'react';
import axios from 'axios';
import { browserHistory } from 'react-router';
import { GOOGLE_CLIENT_ID } from '../../constants/ApiConstants';

let $ = require('jquery');

class Login extends React.Component {

    constructor(props) {
        super(props);

        this.onSuccess = this.onSuccess.bind(this);
        this.onFailure = this.onFailure.bind(this);
    }

    componentWillMount() {
        $('body').addClass('has-blue-background');
        $.getScript('https://apis.google.com/js/api:client.js', this.initLogin.bind(this));
    }


    onSuccess(googleUser) {
        // Get the access token that we can use to authenticate at backend
        var googleAccessToken = googleUser.getAuthResponse().access_token;
        this.props.getBackendAccessToken(googleAccessToken);
    }

    onFailure(err) {
        // Failure connecting to Google.
    }

    initLogin() {
        var googleClientId = GOOGLE_CLIENT_ID;

        var gapi = window.gapi;

        gapi.load('auth2', () => {
            let auth2;

            // Setup Google plus sign-in
            auth2 = gapi.auth2.init({
                client_id: googleClientId,
                scope: 'email',
            });

            auth2.then(() => {
                auth2.attachClickHandler('google-plus-signin-button', {}, this.onSuccess);

                if (auth2.isSignedIn.get()) {
                    this.onSuccess(auth2.currentUser.get());
                }
            });
        });
    }

    /**
    * Just tell the auth2 object to sign out. This should be the moment to clear access token & refresh token.
    */
    handleLoggedOutUser(event) {
        event.preventDefault();
        this.auth2.signOut().then(() => {
            // Succesfully logged out.
        });
    }


    render() {

        if (this.props.user.loading) {
            return (
                <div className="spinner">
                    <div className="bounce1" />
                    <div className="bounce2" />
                    <div className="bounce3" />
                </div>
            );
        }

        return (
            <div className="l-container">
                <div className="login--wrapper">
                    <h1>Inloggen</h1>

                    { this.props.user.error &&
                        <div className="label--alert">
                            { this.props.user.error.statusText }
                        </div>
                    }

                    <form action="index.html">
                        <ul className="login--form">
                            <li>
                                <label htmlFor="email">E-mail</label>
                                <input id="email" type="text" />
                            </li>
                            <li>
                                <label htmlFor="password">Password</label>
                                <input id="password" type="password" />
                            </li>
                        </ul>

                        <div className="login--actions">
                            <a href="/">Wachtwoord vergeten?</a>
                        </div>

                        <div className="login--actions">
                            <button type="submit" className="login--button">
                                Login
                                <i className="fa fa-chevron-right" />
                            </button>
                        </div>
                    </form>

                    <hr />

                    <a id="google-plus-signin-button" className="login--google">
                        <img src="/compiled-assets/images/google.png" alt="Login with Google" />
                        Sign in with Google
                        <i className="fa fa-chevron-right" />
                    </a>

                </div>
            </div>
        );
    }
}

Login.propTypes = {
    getBackendAccessToken: React.PropTypes.func,
    user: React.PropTypes.object,
};

export default Login;

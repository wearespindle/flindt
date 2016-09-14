/*
  AppContainer
  <AppContainer/>
*/

import React from 'react';
import axios from 'axios';
import { browserHistory } from 'react-router';

import Main from './Main';
import Login from './pages/LoginContainer';

let $ = require('jquery');


class AppContainer extends React.Component {

    constructor(props) {
        super(props);

        this.onSuccess = this.onSuccess.bind(this);
        this.onFailure = this.onFailure.bind(this);
        this.handleLoggedOutUser = this.handleLoggedOutUser.bind(this);
    }

    componentWillMount() {
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
        var googleClientId = '197265624471-f8cb8sdb8dr1uevsscev16191ksr3ln6.apps.googleusercontent.com';

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
                } else {
                    browserHistory.push('/login');
                }
            });
        });
    }

    /**
    * Just tell the auth2 object to sign out. This should be the moment to clear access token & refresh token.
    */
    handleLoggedOutUser(event) {
        event.preventDefault();
        const gapi = window.gapi;
        gapi.auth2.getAuthInstance().signOut().then(() => {
            browserHistory.push('/login');
        });
    }


    render() {
        if (!this.props.user.loggedIn) {
            return (
                <div className="spinner">
                    <div className="bounce1" />
                    <div className="bounce2" />
                    <div className="bounce3" />
                </div>
            );
        }

        if (this.props.user.loggedIn) {
            return <Main {...this.props} handleLoggedOutUser={this.handleLoggedOutUser} />;
        }

        return null;
    }
}

AppContainer.propTypes = {
    getBackendAccessToken: React.PropTypes.func,
    user: React.PropTypes.object,
};

export default AppContainer;

import React, { Component } from 'react';
import { browserHistory } from 'react-router';

import { connect } from 'react-redux';

let $ = require('jquery');

class Login extends Component {

    constructor(props) {
        super(props);

        this.onSuccess = this.onSuccess.bind(this);
    }

    componentWillMount() {
        $.getScript('https://apis.google.com/js/api:client.js', this.initLogin.bind(this));
        this.setState({loading: false});
    }

    onSuccess(googleUser) {
        this.setState({loading: true});
        browserHistory.push('/');
    }

    initLogin() {
        var googleClientId = '197265624471-f8cb8sdb8dr1uevsscev16191ksr3ln6.apps.googleusercontent.com';
        var gapi = window.gapi;

        gapi.load('auth2', () => {
            let auth2;

            auth2 = gapi.auth2.init({
                client_id: googleClientId,
                scope: 'email',
            });

            auth2.then(() => {
                auth2.attachClickHandler('google-plus-signin-button', {}, this.onSuccess);
            });
        });
    }

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

        return (
            <div className="l-container">
                <div className="login--wrapper">
                    <img className="login--logo" src="/dist/images/logo.png" alt="Flindt" />
                    <p>Use the button below to sign in with your Google account.</p>

                    { this.props.user.error &&
                        <div className="label--alert">The following error returned: {this.props.user.error} 😪</div>
                    }

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
    user: React.PropTypes.object,
};

const mapStateToProps = (state) => ({
    user: state.User.data,
});

export default connect(mapStateToProps)(Login);

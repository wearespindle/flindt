import React, { Component } from 'react';
import axios from 'axios';
import { browserHistory } from 'react-router';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { userLogin, userLoginFailure, userLoginSuccess,
         getUserData, getUserDataFailure, getUserDataSuccess } from '../actions/user';

let $ = require('jquery');

class AuthContainer extends Component {

    constructor(props) {
        super(props);

        this.onSuccess = this.onSuccess.bind(this);
        this.onFailure = this.onFailure.bind(this);
    }

    componentWillMount() {
        this.setState({loading: true});
        $.getScript('https://apis.google.com/js/api:client.js', this.initLogin.bind(this));
    }

    onSuccess(googleUser) {
        var googleAccessToken = googleUser.getAuthResponse().access_token;
        this.props.userLogin(googleAccessToken).then((response) => {
            let data = response.payload.data;
            if (response.payload.status !== 200) {
                if (response.payload.response) {
                    this.props.userLoginFailure('Unauthorized Google account');
                } else {
                    this.props.userLoginFailure('Can\'t reach Google API.');
                }
                window.location.hash = '/login';
            } else {
                this.props.userLoginSuccess(data);
                this.setState({loading: false});

                this.props.getUserData(data.access_token)
                .then((usermeta) => {
                    if (usermeta.payload.status !== 200) {
                        this.props.getUserDataFailure(response.payload.response);
                    } else {
                        this.props.getUserDataSuccess(usermeta.payload.data[0]);
                    }
                });
            }
        });
    }

    onFailure(err) {
        this.err = err;
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
                if (auth2.isSignedIn.get()) {
                    this.onSuccess(auth2.currentUser.get());
                } else {
                    window.location.hash = '/login';
                }
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

        return this.props.children;
    }
}

const mapStateToProps = (state) => ({
    user: state.User.data,
    user_data: state.User.user_data,
});

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        userLogin,
        userLoginFailure,
        userLoginSuccess,
        getUserData,
        getUserDataSuccess,
        getUserDataFailure,
    }, dispatch);
}

AuthContainer.propTypes = {
    userLogin: React.PropTypes.func,
    userLoginFailure: React.PropTypes.func,
    userLoginSuccess: React.PropTypes.func,
    getUserData: React.PropTypes.func,
    getUserDataFailure: React.PropTypes.func,
    getUserDataSuccess: React.PropTypes.func,
    children: React.PropTypes.element.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(AuthContainer);

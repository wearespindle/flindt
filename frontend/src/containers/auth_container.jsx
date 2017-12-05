import React, { Component } from 'react';
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Login from '../pages/Login';

import {
  userLogin,
  userLogout,
  userLoginFailure,
  userLoginSuccess,
  getUserData,
  getUserDataFailure,
  getUserDataSuccess
} from '../actions/user';

import { isLoggedIn, postLoginActions } from '../authorisation/google';

class AuthContainer extends Component {
  componentWillMount() {
    const {
      userLogin,
      userLogout,
      userLoginFailure,
      userLoginSuccess,
      getUserData,
      getUserDataSuccess,
      getUserDataFailure
    } = this.props;

    isLoggedIn()
      .then(() =>
        postLoginActions({
          userLogin,
          userLogout,
          userLoginFailure,
          userLoginSuccess,
          getUserData,
          getUserDataSuccess,
          getUserDataFailure
        })
      )
      .catch(err => {
        console.error(err);
        userLogout();
      });
  }

  render() {
    const { isAuthenticated, loading } = this.props;

    if (loading) {
      return (
        <div className="spinner">
          <div className="bounce1" />
          <div className="bounce2" />
          <div className="bounce3" />
        </div>
      );
    }

    if (isAuthenticated) {
      return this.props.children;
    }

    return <Login />;
  }
}

const mapStateToProps = state => ({
  user: state.User.data,
  userData: state.User.userdata,
  loading: state.User.loading,
  isAuthenticated: state.User.isAuthenticated
});

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      userLogin,
      userLogout,
      userLoginFailure,
      userLoginSuccess,
      getUserData,
      getUserDataSuccess,
      getUserDataFailure
    },
    dispatch
  );
}

AuthContainer.propTypes = {
  userLogin: propTypes.func,
  userLoginFailure: propTypes.func,
  userLoginSuccess: propTypes.func,
  getUserData: propTypes.func,
  getUserDataFailure: propTypes.func,
  getUserDataSuccess: propTypes.func,
  children: propTypes.element.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(AuthContainer);

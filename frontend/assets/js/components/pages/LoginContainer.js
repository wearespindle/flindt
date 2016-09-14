import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

import { userLogin, userLoginSuccess, userLoginFailure, getUserData,
        getUserDataSuccess, getUserDataFailure } from '../../actions/User';

import Login from './Login';

const mapStateToProps = (state) => ({
    user: state.User.data,
    user_data: state.User.user_data,
});

const mapDispatchToProps = (dispatch) => ({

    getBackendAccessToken: (googleToken) =>
        new Promise((resolve, reject) => {
            dispatch(userLogin(googleToken))
            .then((response) => {
                let data = response.payload.data;
                if (response.payload.status !== 200) {
                    dispatch(userLoginFailure(response.payload.response));
                } else {
                    dispatch(userLoginSuccess(data));

                    dispatch(getUserData(data.access_token))
                    .then((usermeta) => {
                        if (usermeta.payload.status !== 200) {
                            dispatch(getUserDataFailure(response.payload.response));
                        } else {
                            dispatch(getUserDataSuccess(usermeta.payload.data[0]));
                        }
                    });

                    browserHistory.push('/');
                }
            });
        }),
});


const LoginContainer = connect(mapStateToProps, mapDispatchToProps)(Login);

export default LoginContainer;

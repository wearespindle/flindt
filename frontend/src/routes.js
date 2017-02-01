import React from 'react';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import promise from 'redux-promise';

// Containers (manage redux state)
import AuthContainer from './containers/auth_container';
import CheckGivenPersonalFeedback from './containers/check_given_personal_feedback';
import EditGivenPersonalFeedback from './containers/edit_given_personal_feedback';
import GiveFeedbackList from './containers/give_feedback_list';
import GivePersonalFeedback from './containers/give_personal_feedback';
import Login from './containers/login_container';
import ReceivedFeedback from './containers/received_feedback';

import GiveRoleFeedback from './containers/give_role_feedback';
import CheckGivenRoleFeedback from './containers/check_given_role_feedback';
import EditGivenRoleFeedback from './containers/edit_given_role_feedback';

// Components
import App from './components/app';
import Home from './components/home';
import ReceivedFeedbackList from './containers/received_feedback_list';

import configureStore from './store/store';
import reducers from './reducers';

const store = configureStore();

export default (
    <Provider store={store}>
        <Router history={browserHistory}>
            <Route path="login" component={Login} />
            <Route component={AuthContainer}>
                <Route path="/" component={App}>
                    <IndexRoute component={Home} />

                    <Route path="give-feedback">
                        <IndexRoute component={GiveFeedbackList} />
                        <Route path="personal/:feedbackId/new" component={GivePersonalFeedback} />
                        <Route path="role/:feedbackId/new" component={GiveRoleFeedback} />

                        <Route path="personal/:feedbackId" component={CheckGivenPersonalFeedback} />
                        <Route path="personal/:feedbackId/edit" component={EditGivenPersonalFeedback} />

                        <Route path="role/:feedbackId" component={CheckGivenRoleFeedback} />
                        <Route path="role/:feedbackId/edit" component={EditGivenRoleFeedback} />
                    </Route>

                    <Route path="received-feedback">
                        <IndexRoute component={ReceivedFeedbackList} />
                        <Route path=":feedbackId" component={ReceivedFeedback} />
                    </Route>

                </Route>
            </Route>
        </Router>
    </Provider>
);

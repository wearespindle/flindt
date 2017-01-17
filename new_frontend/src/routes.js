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
                    <Route path="give-feedback" component={GiveFeedbackList} />

                    <Route path="/give-personal-feedback/:feedbackId" component={GivePersonalFeedback} />
                    <Route path="/given-personal-feedback/:feedbackId" component={CheckGivenPersonalFeedback} />
                    <Route path="/given-personal-feedback/:feedbackId/edit" component={EditGivenPersonalFeedback} />

                    <Route path="/give-role-feedback/:feedbackId" component={GiveRoleFeedback} />
                    <Route path="/given-role-feedback/:feedbackId" component={CheckGivenRoleFeedback} />
                    <Route path="/given-role-feedback/:feedbackId/edit" component={EditGivenRoleFeedback} />

                    <Route path="received-feedback" component={ReceivedFeedbackList} />

                    <Route path="received-feedback/:feedbackId" component={ReceivedFeedback} />
                </Route>
            </Route>
        </Router>
    </Provider>
);

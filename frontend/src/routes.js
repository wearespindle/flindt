import React from 'react';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';
import { Provider } from 'react-redux';

// Containers (manage redux state)
import AuthContainer from './containers/auth_container';
import GiveFeedbackList from './containers/give_feedback_list';
import GiveFeedbackListArchive from './containers/give_feedback_list_archive';
import Login from './containers/login_container';
import ReceivedFeedback from './containers/received_feedback';
import ReceivedFeedbackList from './containers/received_feedback_list';

// Containers for viewing, editing and giving personal feedback.
import CheckPersonalFeedback from './containers/check_personal_feedback';
import EditPersonalFeedback from './containers/edit_personal_feedback';
import GivePersonalFeedback from './containers/give_personal_feedback';

// Containers for viewing, editing and giving feedback a role.
import CheckRoleFeedback from './containers/check_role_feedback';
import EditRoleFeedback from './containers/edit_role_feedback';
import GiveRoleFeedback from './containers/give_role_feedback';

// Components
import App from './components/app';
import Home from './components/home';

// Store
import configureStore from './store/store';

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

                        <Route path="personal/:feedbackId" component={CheckPersonalFeedback} />
                        <Route path="personal/:feedbackId/edit" component={EditPersonalFeedback} />

                        <Route path="role/:feedbackId" component={CheckRoleFeedback} />
                        <Route path="role/:feedbackId/edit" component={EditRoleFeedback} />

                        <Route path="archive" component={GiveFeedbackListArchive} />
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

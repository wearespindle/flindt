// import createHistory from 'history/lib/createHashHistory';
import React from 'react';
import { BrowserRouter, Switch, Route, IndexRoute, useRouterHistory } from 'react-router-dom';
import { Provider } from 'react-redux';
import pages from './pages/';
import configureStore from './store/store';

const store = configureStore();

// Containers (manage redux state)
// import AuthContainer from './containers/auth_container';
// import GiveFeedbackList from './containers/give_feedback_list';
// import GiveFeedbackListArchive from './containers/give_feedback_list_archive';
// import Login from './containers/login_container';
// import ReceivedFeedback from './containers/received_feedback';
// import ReceivedFeedbackList from './containers/received_feedback_list';

// Containers for viewing, editing and giving personal feedback.
// import CheckPersonalFeedback from './containers/check_personal_feedback';
// import EditPersonalFeedback from './containers/edit_personal_feedback';
// import GivePersonalFeedback from './containers/give_personal_feedback';

// Containers for viewing, editing and giving feedback a role.
// import CheckRoleFeedback from './containers/check_role_feedback';
// import EditRoleFeedback from './containers/edit_role_feedback';
// import GiveRoleFeedback from './containers/give_role_feedback';

// Components
// import App from './components/app';
// import Home from './components/home';
// import NotFound from './components/not_found';

// Store

// History. We use a custom hash history that does not use ugly '_k' params:
// https://github.com/ReactTraining/react-router/issues/1967
// const appHistory = useRouterHistory(createHistory)({ queryKey: false });

export default () => (
  <Provider store={store}>
    <BrowserRouter>
      <Switch>
        <Route path="/login" component={pages.Login} />

        <Route path="/received-feedback:feedbackId" component={pages.ReceivedFeedback} />
        <Route path="/received-feedback" component={pages.ReceivedFeedbackList} />

        <Route path="give-feedback/personal/:feedbackId/new" component={pages.GivePersonalFeedback} />
        <Route path="give-feedback/personal/:feedbackId/edit" component={pages.EditPersonalFeedback} />
        <Route path="give-feedback/personal/:feedbackId" component={pages.CheckPersonalFeedback} />

        <Route path="give-feedback/role/:feedbackId/edit" component={pages.EditRoleFeedback} />
        <Route path="give-feedback/role/:feedbackId/new" component={pages.GiveRoleFeedback} />
        <Route path="give-feedback/role/:feedbackId" component={pages.CheckRoleFeedback} />

        <Route path="give-feedback/archive" component={pages.GiveFeedbackListArchive} />

        <Route path="give-feedback" component={pages.GiveFeedbackList} />

        <Route path="*" component={pages.NotFound} />
      </Switch>
    </BrowserRouter>
  </Provider>
);

import React from 'react';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';
import { Provider } from 'react-redux';



// Main app connector.
import App from './components/App';
import LoginContainer from './components/pages/LoginContainer';

// Pages.
import GiveFeedback from './components/pages/GiveFeedback';
import CheckGivenFeedback from './components/pages/CheckGivenFeedback';
import ReceivedFeedback from './components/pages/ReceivedFeedback';
import Login from './components/pages/Login';

// Components.
import FeedbackFormRole from './components/feedback/FeedbackFormRole';
import FeedbackFormPersonal from './components/feedback/FeedbackFormPersonal';
import ReceivedFeedbackSingle from './components/feedback/ReceivedFeedbackSingle';

import configureStore from './store/store.js';

const store = configureStore();

export default (
    <Provider store={store}>
        <Router history={browserHistory}>
            <Route path="/" component={App}>
                <IndexRoute component={GiveFeedback} />
                <Route path="/give-personal-feedback/:feedbackId" component={FeedbackFormPersonal} />
                <Route path="/edit-personal-feedback/:feedbackId" component={FeedbackFormPersonal} />
                <Route path="/give-feedback/:feedbackId" component={FeedbackFormRole} />
                <Route path="/edit-feedback/:feedbackId" component={FeedbackFormRole} />
                <Route path="/check-feedback/:feedbackId" component={CheckGivenFeedback} />
                <Route path="/received-feedback" component={ReceivedFeedback} />
                <Route path="/received-feedback/:feedbackId" component={ReceivedFeedbackSingle} />
            </Route>
            <Route path="/login" component={LoginContainer} />
        </Router>
    </Provider>
);

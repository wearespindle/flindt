import React  from 'react';
import ReactDOM  from 'react-dom';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';
import { Provider } from 'react-redux';

// Main app connector.
import App from './components/App';

// Pages.
import GiveFeedback from './components/pages/GiveFeedback';
import ReceivedFeedback from './components/pages/ReceivedFeedback';

// Components.
import FeedbackFormGeneral from './components/feedback/FeedbackFormGeneral';
import FeedbackFormPerson from './components/feedback/FeedbackFormPerson';
import ReceivedFeedbackSingle from './components/feedback/ReceivedFeedbackSingle';

import configureStore from './store/store.js';

const store = configureStore();

var routes = (
    <Provider store={store}>
        <Router history={browserHistory}>
            <Route path="/" component={App}>
                <IndexRoute component={GiveFeedback} />
                <Route path="/give-personal-feedback/:personId" component={FeedbackFormPerson} />
                <Route path="/give-feedback/:feedbackId" component={FeedbackFormGeneral}/>
                <Route path="/received-feedback" component={ReceivedFeedback} />
                <Route path="/received-feedback/:feedbackId" component={ReceivedFeedbackSingle} />
            </Route>
        </Router>
    </Provider>
);

ReactDOM.render(routes, document.querySelector('#main'));

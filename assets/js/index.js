import React  from 'react';
import ReactDOM  from 'react-dom';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';
import { Provider } from 'react-redux';
import store, { history } from './store/store';

// Main app connector.
import App from './components/App';

// Pages.
import Home from './components/pages/Home';
import GiveFeedback from './components/pages/GiveFeedback';
import ReceivedFeedback from './components/pages/ReceivedFeedback';

// Components.
import FeedbackFormGeneral from './components/feedback/FeedbackFormGeneral';
import FeedbackFormPerson from './components/feedback/FeedbackFormPerson';
import ReceivedFeedbackSingle from './components/feedback/ReceivedFeedbackSingle';

var routes = (
    <Provider store={store}>
        <Router history={history}>
            <Route path="/" component={App}>
                <IndexRoute component={Home} />
                <Route path="/give-feedback/person/:feedbackId" component={FeedbackFormPerson} />
                <Route path="/give-feedback/:feedbackId" component={FeedbackFormGeneral}/>
                <Route path="/give-feedback" component={GiveFeedback}/>
                <Route path="/received-feedback" component={ReceivedFeedback} />
                <Route path="/received-feedback/:feedbackId" component={ReceivedFeedbackSingle} />
            </Route>
        </Router>
    </Provider>
);

ReactDOM.render(routes, document.querySelector('#main'));

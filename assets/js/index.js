import React  from 'react';
import ReactDOM  from 'react-dom';
import { Router, Route, browserHistory, Link, IndexRoute } from 'react-router';

import App from './components/App';
import Home from './components/Home';
import GiveFeedback from './components/GiveFeedback';
import GiveFeedbackPerson from './components/GiveFeedbackPerson';
import ReceivedFeedback from './components/ReceivedFeedback';

import { Provider } from 'react-redux';
import store, { history } from './store';


/*
  Routes
*/

var routes = (
    <Provider store={store}>
        <Router history={history}>
            <Route path="/" component={App}>
                <IndexRoute component={Home} />
                <Route path="/received-feedback" component={ReceivedFeedback} />
                <Route path="/give-feedback-person" component={GiveFeedbackPerson} />
                <Route path="/give-feedback/:feedbackId" component={GiveFeedback}/>
            </Route>
        </Router>
    </Provider>
);

ReactDOM.render(routes, document.querySelector('#main'));

import React  from 'react';
import ReactDOM  from 'react-dom';
import { Router, Route, browserHistory, Link, IndexRoute } from 'react-router';

import App from './components/App';
import Home from './components/Home';
import GiveFeedback from './components/GiveFeedback';
import GiveFeedbackPerson from './components/GiveFeedbackPerson';
import ReceivedFeedback from './components/ReceivedFeedback';


/*
  Routes
*/

var routes = (
  <Router history={browserHistory}>
    <Route path="/" component={App}>
        <IndexRoute component={Home} />
        <Route path="/give-feedback" component={GiveFeedback} />
        <Route path="/received-feedback" component={ReceivedFeedback} />
        <Route path="/give-feedback-person" component={GiveFeedbackPerson} />
    </Route>
  </Router>
)

ReactDOM.render(routes, document.querySelector('#main'));

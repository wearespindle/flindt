import React  from 'react';
import ReactDOM  from 'react-dom';
import { Router, Route, browserHistory, Link, IndexRoute } from 'react-router';

import Main from './components/Main';
import Home from './components/Home';
import GiveFeedback from './components/GiveFeedback';
import GiveFeedbackPerson from './components/GiveFeedbackPerson';
import ReceivedFeedback from './components/ReceivedFeedback';


/*
  Routes
*/

var routes = (
  <Router history={browserHistory}>
    <Route path="/" component={Main}>
        <IndexRoute component={Home} />
        <Route path="/received-feedback" component={ReceivedFeedback} />
        <Route path="/give-feedback-person" component={GiveFeedbackPerson} />
        <Route path="/give-feedback/:feedbackId" component={GiveFeedback}/>
    </Route>
  </Router>
);

ReactDOM.render(routes, document.querySelector('#main'));

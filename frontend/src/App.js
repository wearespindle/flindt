import React, { Component, Fragment } from 'react';
import propTypes from 'prop-types';
import { Switch, Route, NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Notifications from 'react-notification-system-redux';
import { withRouter } from 'react-router-dom';

import logo from './assets/images/logo.svg';

import { showRoleModal } from './actions/modal';
import { userLogout } from './actions/user';

import RoleModal from './components/RoleModal';
import SkipFeedbackModal from './components/SkipFeedbackModal';

import { logOut } from './authorisation/google';

import AskFeedback from './pages/AskFeedback';
import CheckPersonalFeedback from './pages/CheckPersonalFeedback';
import CheckRoleFeedback from './pages/CheckRoleFeedback';
import EditPersonalFeedback from './pages/EditPersonalFeedback';
import EditRoleFeedback from './pages/EditRoleFeedback';
import GiveFeedbackList from './pages/GiveFeedbackList';
import GiveFeedbackListArchive from './pages/GiveFeedbackListArchive';
import GivePersonalFeedback from './pages/GivePersonalFeedback';
import GiveRoleFeedback from './pages/GiveRoleFeedback';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import ReceivedFeedback from './pages/ReceivedFeedback';
import ReceivedFeedbackList from './pages/ReceivedFeedbackList';

import AuthContainer from './containers/auth_container';

class App extends Component {
  handleLogOutUser = e => {
    e.preventDefault();
    logOut()
      .then(() => {
        this.props.userLogout();
      })
      .catch(console.error);
  };

  render() {
    const { modal, notifications } = this.props;

    return (
      <AuthContainer>
        <Fragment>
          <div className="app-wrapper">
            <div className="navigation--wrapper">
              <div className="content--header-spacing mobile">
                <img src={logo} alt="Flindt" />
              </div>

              <ul className="navigation">
                <li>
                  <NavLink activeClassName="is-active" exact to="/">
                    Home <i className="fa fa-home" />
                  </NavLink>
                </li>
                <li>
                  <NavLink activeClassName="is-active" to="/give-feedback">
                    Give feedback <i className="fa fa-undo" />
                  </NavLink>
                </li>
                <li>
                  <NavLink activeClassName="is-active" to="/received-feedback">
                    Received feedback <i className="fa fa-thumbs-up" />
                  </NavLink>
                </li>
                <li>
                  <NavLink activeClassName="is-active" to="/ask-feedback">
                    Ask Feedback <i className="fa fa-question-circle" />
                  </NavLink>
                </li>
                <li className="logout--link">
                  <a href="/logout" tabIndex="-1" onClick={this.handleLogOutUser}>
                    Logout <i className="fa fa-sign-out" />
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <Switch>
                <Route path="/received-feedback/:feedbackId" component={ReceivedFeedback} />
                <Route path="/received-feedback" component={ReceivedFeedbackList} />

                <Route
                  path="/give-feedback/personal/:feedbackId/new"
                  component={GivePersonalFeedback}
                />
                <Route
                  path="/give-feedback/personal/:feedbackId/edit"
                  component={EditPersonalFeedback}
                />
                <Route
                  path="/give-feedback/personal/:feedbackId"
                  component={CheckPersonalFeedback}
                />
                <Route path="/give-feedback/role/:feedbackId/edit" component={EditRoleFeedback} />
                <Route path="/give-feedback/role/:feedbackId/new" component={GiveRoleFeedback} />
                <Route path="/give-feedback/role/:feedbackId" component={CheckRoleFeedback} />
                <Route path="/give-feedback/archive" component={GiveFeedbackListArchive} />

                <Route path="/ask-feedback" component={AskFeedback} />

                <Route path="/give-feedback" component={GiveFeedbackList} />

                <Route path="/" exact component={Home} />
                <Route path="*" component={NotFound} />
              </Switch>
            </div>
          </div>
          <RoleModal details={modal} isOpen={modal.isOpen} {...this.props} />
          <SkipFeedbackModal isOpen={modal.skipFeedbackModalisOpen} {...this.props} />
          <Notifications notifications={notifications} />
        </Fragment>
      </AuthContainer>
    );
  }
}

App.propTypes = {
  modal: propTypes.object,
  notifications: propTypes.array
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      userLogout,
      showRoleModal
    },
    dispatch
  );
}

const mapStateToProps = state => ({
  modal: state.Modal,
  notifications: state.Notifications
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, IndexLink, browserHistory } from 'react-router';
import Notifications from 'react-notification-system-redux';

import InfoModal from '../components/modal';
import Header from '../components/header';

import { showModal } from '../actions/modal';

class App extends Component {

    constructor(props) {
        super(props);
        this.handleLoggedOutUser = this.handleLoggedOutUser.bind(this);
    }

    handleLoggedOutUser(event) {
        this.event = event;
        event.preventDefault();
        const gapi = window.gapi;
        gapi.auth2.getAuthInstance().signOut().then(() => {
            browserHistory.push('/login');
        });
    }

    render() {
        const { modal, notifications } = this.props;
        return (
            <div className="app-wrapper">
                <div className="navigation--wrapper">
                    <div className="content--header-spacing mobile">
                        <img src="/dist/images/logo.png" alt="Flindt" />
                    </div>

                    <ul className="navigation">
                        <li><IndexLink activeClassName="is-active" to="/">
                        Home <i className="fa fa-home" /></IndexLink>
                        </li>
                        <li><Link activeClassName="is-active" to="/give-feedback">
                        Give feedback <i className="fa fa-undo" /></Link>
                        </li>
                        <li><Link activeClassName="is-active" to="/received-feedback">
                            Received feedback <i className="fa fa-thumbs-up" /></Link>
                        </li>
                        <li className="logout--link">
                            <a href="/logout" tabIndex="-1" onClick={this.handleLoggedOutUser}>
                                Logout <i className="fa fa-sign-out" />
                            </a>
                        </li>
                    </ul>
                </div>

                {this.props.children}

                <InfoModal details={modal} isOpen={modal.isOpen} {...this.props} />
                <Notifications notifications={notifications} />
            </div>
        );
    }
}

App.propTypes = {
    children: React.PropTypes.object,
    modal: React.PropTypes.object,
    notifications: React.PropTypes.array,
};

const mapStateToProps = (state) => ({
    modal: state.Modal,
    notifications: state.Notifications,
});

export default connect(mapStateToProps, {showModal})(App);

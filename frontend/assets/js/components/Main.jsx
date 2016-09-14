/*
  Main
  Landingspage for the feedback app
*/

import React from 'react';
import { Link } from 'react-router';
import Notifications from 'react-notification-system-redux';

import InfoModal from './addons/InfoModal';
import Login from './pages/Login';

let $ = require('jquery');

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isModalOpen: false,
        };

        // React components using ES6 classes no longer autobind
        // this to non React methods. Manually binding solves this issue.
        this._showModal = this._showModal.bind(this);
        this._closeModal = this._closeModal.bind(this);
    }

    _showModal(parameters) {
        let modalDetails = parameters;
        this.setState({isModalOpen: true, modalDetails});
    }

    _closeModal() {
        this.setState({isModalOpen: false});
    }


    render() {
        $('body').removeClass('has-blue-background');

        return (
            <div className="app-wrapper">
                <div className="navigation--wrapper">
                    <ul className="navigation">
                        <li><Link activeClassName="is-active" to="/">
                            Feedback geven <i className="fa fa-undo" /></Link>
                        </li>
                        <li><Link activeClassName="is-active" to="/received-feedback">
                            Ontvangen feedback <i className="fa fa-thumbs-up" /></Link>
                        </li>
                        <li className="logout--link">
                            <a onClick={this.props.handleLoggedOutUser}>
                                Uitloggen <i className="fa fa-sign-out" />
                            </a>
                        </li>
                    </ul>
                </div>

                {React.cloneElement(this.props.children, {showModal: this._showModal, ...this.props})}

                { this.state.isModalOpen &&
                    <InfoModal details={this.state.modalDetails} closeModal={this._closeModal} {...this.props} />
                }
                { this.props.Notifications.length > 0 &&
                    <Notifications notifications={this.props.Notifications} />
                }


            </div>
        );
    }
}

Main.propTypes = {
    children: React.PropTypes.object,
    user: React.PropTypes.object,
    handleLoggedOutUser: React.PropTypes.func,
    Notifications: React.PropTypes.array,
};

export default Main;

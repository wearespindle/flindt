/*
  Main
  Landingspage for the feedback app
*/

import React from 'react';
import { Link } from 'react-router';
import InfoModal from './addons/InfoModal';

var Main = React.createClass({
    getInitialState() {
        return {
            isModalOpen: false,
        };
    },

    showModal(parameters) {
        let modalDetails = parameters;
        this.setState({isModalOpen: true, modalDetails});
    },

    closeModal() {
        this.setState({isModalOpen: false});
    },

    render() {
        let modal;

        if (this.state.isModalOpen) {
            modal = <InfoModal details={this.state.modalDetails} closeModal={this.closeModal} />;
        }

        return (
            <div className="app-wrapper">
                <div className="navigation--wrapper">
                    <ul className="navigation">
                        <li><Link activeClassName="is-active" to="/">Feedback geven<i className="fa fa-undo"></i></Link></li>
                        <li><Link activeClassName="is-active" to="/received-feedback">Ontvangen feedback <i className="fa fa-thumbs-up"></i></Link></li>
                    </ul>
                </div>

                {React.cloneElement(this.props.children, {showModal: this.showModal, ...this.props})}

                { modal }

            </div>
        );
    },
});

export default Main;

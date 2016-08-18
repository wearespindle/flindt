/*
  Main
  Landingspage for the feedback app
*/

import React from 'react';
import { Link } from 'react-router';
import InfoModal from './InfoModal';

var Main = React.createClass({
    getInitialState() {
        return {
            isModalOpen: false,
        }
    },

    showModal(parameters) {
        let modalDetails = parameters;
        this.setState({isModalOpen: true, modalDetails});
    },

    closeModal() {
        this.setState({isModalOpen: false});
    },

    render() {
        const childrenWithProps = React.Children.map(this.props.children,
            (child) => React.cloneElement(child, {
                showModal: this.showModal
            })
        );

        return (
            <div className="app-wrapper">
                <div className="navigation--wrapper">
                    <ul className="navigation">
                        <li><Link activeClassName="is-active" to="/">Home<i className="fa fa-home"></i></Link></li>
                        <li><Link activeClassName="is-active" to="/give-feedback">Feedback geven<i className="fa fa-undo"></i></Link></li>
                        <li><Link activeClassName="is-active" to="/received-feedback">Ontvangen feedback <i className="fa fa-thumbs-up"></i></Link></li>
                    </ul>
                </div>

                { childrenWithProps }

                <InfoModal isOpen={this.state.isModalOpen} details={this.state.modalDetails} closeModal={this.closeModal}/>
            </div>
        )
    }
});

export default Main;

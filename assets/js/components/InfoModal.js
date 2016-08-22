/*
  InfoModal
  <InfoModal />
*/

import React from 'react';
import {Link} from 'react-router';

var $ = require('jquery');

var InfoModal = React.createClass({
    getInitialState: function() {
        return {
            data: null,
        };
    },

    componentDidMount() {
        let id = this.props.details.roleId;
        this.serverRequest = $.get(`https://glassfrog.holacracy.org/api/v3/roles/${id}?api_key=d0f15c2543e30e70e4dcc6d6b3331170430a198b`, function(result) {
            let roleDetails = result.roles[0];
            let {name, purpose} = roleDetails;
            let accountabilities = result.linked.accountabilities;

            this.setState({
                data: {
                    purpose,
                    name,
                    accountabilities,
                },
            });
        }.bind(this));
    },

    componentWillUnmount() {
        this.serverRequest.abort();
    },

    closeModal() {
        this.props.closeModal();
    },

    renderAccountability(key) {
        return <li key={key}>{ this.state.data.accountabilities[key].description }</li>;
    },

    render() {
        if (this.state.data === null) {
            return (
                <div>
                    <div className="modal--wrapper show">
                        <a onClick={this.closeModal} className="modal--close"><i className="fa fa-close"></i></a>
                        <div className="modal--content">
                            <div className="spinner">
                                <div className="bounce1"></div>
                                <div className="bounce2"></div>
                                <div className="bounce3"></div>
                            </div>
                        </div>
                    </div>
                    <div className="overlay show"></div>
                </div>
            );
        }

        let {name, purpose, accountabilities} = this.state.data;

        return (
            <div>
                <div className="modal--wrapper show">
                    <a onClick={this.closeModal} className="modal--close"><i className="fa fa-close"></i></a>
                    <h2>{ name }</h2>

                    <div className="modal--content">
                        <h3>Purpose</h3>
                        <p>{ purpose }</p>

                        <h3>Accountabilities</h3>
                        <ul>
                            { Object.keys(accountabilities).map(this.renderAccountability) }
                        </ul>
                    </div>
                </div>
                <div className="overlay show"></div>
            </div>
        );
    },
});

export default InfoModal;

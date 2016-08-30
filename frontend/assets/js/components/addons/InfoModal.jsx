/*
  InfoModal
  <InfoModal />
*/

import React from 'react';
import {Link} from 'react-router';

// Require jQuery for the AJAX call.
var $ = require('jquery');

class InfoModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: null,
        };
    }

    componentDidMount() {
        let id = this.props.details.glassFrogId;
        this.serverRequest = $.get(`https://glassfrog.holacracy.org/api/v3/roles/
                                    ${id}?api_key=d0f15c2543e30e70e4dcc6d6b3331170430a198b`,
                                    (result) => {
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
                                    });
    }

    componentWillUnmount() {
        this.serverRequest.abort();
    }

    render() {
        // If the data is null, show a spinner.
        if (this.state.data === null) {
            return (
                <div>
                    <div className="modal--wrapper show">
                        <a onClick={this._closeModal} className="modal--close"><i className="fa fa-close" /></a>
                        <div className="modal--content">
                            <div className="spinner">
                                <div className="bounce1" />
                                <div className="bounce2" />
                                <div className="bounce3" />
                            </div>
                        </div>
                    </div>
                    <div className="overlay show" />
                </div>
            );
        }

        let {name, purpose, accountabilities} = this.state.data;

        return (
            <div>
                <div className="modal--wrapper show">
                    <a onClick={this.props.closeModal} className="modal--close"><i className="fa fa-close" /></a>
                    <h2>{ name }</h2>

                    <div className="modal--content">
                        <h3>Purpose</h3>
                        <p>{ purpose }</p>

                        <h3>Accountabilities</h3>
                        <ul>
                            {
                                Object.keys(accountabilities).map((key) =>
                                    <li key={key}>{ this.state.data.accountabilities[key].description }</li>
                                )
                            }
                        </ul>
                    </div>
                </div>
                <div className="overlay show" />
            </div>
        );
    }
}


InfoModal.propTypes = {
    closeModal: React.PropTypes.func,
    details: React.PropTypes.object,
};

export default InfoModal;

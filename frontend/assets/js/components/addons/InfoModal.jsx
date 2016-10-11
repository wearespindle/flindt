/*
  InfoModal
  <InfoModal />
*/

import React from 'react';
import {Link} from 'react-router';
import axios from 'axios';

import { API_URL } from '../../constants/ApiConstants';

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
        let id = this.props.details.roleId;
        let accessToken = this.props.user.user.access_token;

        axios({
            method: 'GET',
            url: `${API_URL}/api/v1/roles/${id}/`,
            headers: {Authorization: `Bearer ${accessToken}`},
        }).then((response) => {
            const { name, purpose, accountabilities } = response.data;
            this.setState({
                data: {
                    name,
                    purpose,
                    accountabilities,
                },
            });
        }).catch((error) => {
        });

        console.log(this.state.data);
    }

    render() {
        // If the data is null, show a spinner.
        if (this.state.data === null) {
            return (
                <div>
                    <div className="modal--wrapper show">
                        <a onClick={this.props.closeModal} className="modal--close"><i className="fa fa-close" /></a>
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
        let accountabilitiesArray;
        accountabilitiesArray = accountabilities.replace(/'/g, '"');
        accountabilitiesArray = JSON.parse(accountabilitiesArray);

        return (
            <div>
                <div className="modal--wrapper show">
                    <a onClick={this.props.closeModal} className="modal--close"><i className="fa fa-close" /></a>
                    <h2>{ name }</h2>

                    <div className="modal--content">
                        <h3>Purpose</h3>
                        <p>{ purpose }</p>

                        { accountabilitiesArray &&
                            <div>
                                <h3>Accountabilities</h3>
                                <ul>
                                    {
                                        accountabilitiesArray.map((accountability, index) =>
                                            <li key={index}>{accountability}</li>
                                        )
                                    }
                                </ul>
                            </div>
                        }
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
    user: React.PropTypes.object,
};

export default InfoModal;

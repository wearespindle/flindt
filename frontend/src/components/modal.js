import React, { Component } from 'react';
import { connect } from 'react-redux';

import { hideModal } from '../actions/modal';

class InfoModal extends Component {

    render() {
        if (!this.props.isOpen) {
            return null;
        }

        // If the data is null, show a spinner.
        if (!this.props.details) {
            return (
                <div>
                    <div className="modal--wrapper show">
                        <a onClick={() => this.props.hideModal()} className="modal--close">
                            <i className="fa fa-close" />
                        </a>
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

        let {name, purpose, accountabilities} = this.props.details.data;
        let accountabilitiesArray;

        if (accountabilities) {
            accountabilitiesArray = accountabilities.replace(/'/g, '"');
            accountabilitiesArray = JSON.parse(accountabilitiesArray);
        }

        return (
            <div>
                <div className="modal--wrapper show">
                    <a onClick={() => this.props.hideModal()} className="modal--close">
                        <i className="fa fa-close" />
                    </a>

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
    hideModal: React.PropTypes.func,
    details: React.PropTypes.object,
    isOpen: React.PropTypes.bool,
};

export default connect(null, {hideModal})(InfoModal);

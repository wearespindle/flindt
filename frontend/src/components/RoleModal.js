import React, { Component } from 'react';
import propTypes from 'prop-types';
import { connect } from 'react-redux';

import { hideModal } from '../actions/modal';

class RoleModal extends Component {
  componentDidMount() {
    document.addEventListener('keydown', this.escFunction, false);
  }
  componentWillUnmount() {
    document.removeEventListener('keydown', this.escFunction, false);
  }

  // Close the modal when pressing escape.
  escFunction = e => {
    if (e.keyCode === 27) {
      this.props.hideModal();
    }
  };

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

    let { name, purpose, accountabilities } = this.props.details.data;

    return (
      <div>
        <div className="modal--wrapper show">
          <a onClick={() => this.props.hideModal()} className="modal--close">
            <i className="fa fa-close" />
          </a>

          <h2>{name}</h2>

          <div className="modal--content">
            <h3>Purpose</h3>
            <p>{purpose}</p>

            {accountabilities && (
              <div>
                <h3>Accountabilities</h3>
                <ul>
                  {accountabilities.map((accountability, index) => (
                    <li key={index}>{accountability}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
        <div className="overlay show" />
      </div>
    );
  }
}

RoleModal.propTypes = {
  hideModal: propTypes.func,
  details: propTypes.object,
  isOpen: propTypes.bool
};

export default connect(null, { hideModal })(RoleModal);

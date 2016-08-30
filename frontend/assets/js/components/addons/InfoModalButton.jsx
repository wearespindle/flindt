/*
  InfoModalButton
  <InfoModalButton />
*/

import React from 'react';

class InfoModalButton extends React.Component {

    constructor(props) {
        super(props);

        this._openModal = this._openModal.bind(this);
    }

    _openModal() {
        const details = {
            glassFrogId: this.props.glassFrogId,
        };

        this.props.showModal(details);
    }

    render() {
        return (
            <a onClick={this._openModal} className="show--modal">
                <i className="fa fa-info-circle" />
            </a>
        );
    }
}


InfoModalButton.propTypes = {
    _openModal: React.PropTypes.func,
    showModal: React.PropTypes.func,
    glassFrogId: React.PropTypes.number,
};

export default InfoModalButton;

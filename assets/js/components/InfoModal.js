/*
  InfoModal
  <InfoModal />
*/

import React from 'react';
import { Link } from 'react-router';

var $ = require('jquery');

var InfoModal = React.createClass({
    getInitialState: function() {
      return {
        data: null
      };
    },

    componentDidMount() {


    },

    setData(id) {
        let roleId = id;
        this.serverRequest = $.get('https://glassfrog.holacracy.org/api/v3/roles/'+roleId+'?api_key=d0f15c2543e30e70e4dcc6d6b3331170430a198b', function (result) {
            let roleDetails = result.roles[0];

          this.setState({
            data: {
                purpose: roleDetails.purpose,
                name: roleDetails.name,
            }
          });
        }.bind(this));
    },

    closeModal() {
        this.setState({data: null});
        this.props.closeModal();
    },

    render() {
        if (this.props.isOpen === false)
            return null;

        let data = this.props.details;

        this.setData(data.roleId);

        return (
            <div>
                <div className="modal--wrapper show">
                    <a onClick={this.closeModal} className="modal--close"><i className="fa fa-close"></i></a>
                    <h2>{ this.state.data.name }</h2>

                    <div className="modal--content">
                        <h3>Purpose</h3>
                        <p>{ this.state.data.purpose }</p>

                        <h3>Accountabilities</h3>
                        <ul>
                            <li>Removing constraints within the broader Organization that limit the Sub-Circle</li>
                            <li>Seeking to understand Tensions conveyed by Sub-Circle Circle Members, and discerning those appropriate to process in the Super-Circle</li>
                            <li>Providing visibility to the Super-Circle into the health of the Sub-Circle, including reporting on any metrics or checklist items assigned to the whole Sub-Circle</li>
                        </ul>
                    </div>
                </div>
                <div className="overlay show"></div>
            </div>
        )
    }
});

export default InfoModal;

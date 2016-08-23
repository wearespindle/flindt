/*
  GiveFeedback
  <GiveFeedback/>
*/

import React from 'react';
import GiveFeedbackListContainer from '../feedback/GiveFeedbackListContainer';

var GiveFeedback = React.createClass({
    render() {
        return (
            <div className="content--wrapper">
                <div className="content--header">
                    <div className="content--header-spacing"></div>
                    <div className="content--header-breadcrumbs">
                        <ul>
                            <li>Feedback geven</li>
                        </ul>
                    </div>
                </div>

                <div className="content">
                    <GiveFeedbackListContainer {...this.props}/>
                </div>
            </div>
        );
    },
});

export default GiveFeedback;

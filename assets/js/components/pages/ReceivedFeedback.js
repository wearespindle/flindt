/*
  ReceivedFeedback
  <ReceivedFeedback/>
*/

import React from 'react';
import ReceivedFeedbackListContainer from '../feedback/ReceivedFeedbackListContainer';

var ReceivedFeedback = React.createClass({
    render() {
        return (
            <div className="content--wrapper">
                <div className="content--header">
                    <div className="content--header-spacing"></div>
                    <div className="content--header-breadcrumbs">
                        <ul>
                            <li>Ontvangen feedback</li>
                        </ul>
                    </div>
                </div>

                <div className="content">
                    <ReceivedFeedbackListContainer {...this.props}/>
                </div>
            </div>
        );
    },
});

export default ReceivedFeedback;

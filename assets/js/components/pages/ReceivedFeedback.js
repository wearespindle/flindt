/*
  ReceivedFeedback
  <ReceivedFeedback/>
*/

import React from 'react';
import FeedbackList from '../feedback/as_receiver/FeedbackList';

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
                    <FeedbackList {...this.props}/>
                </div>
            </div>
        );
    },
});

export default ReceivedFeedback;

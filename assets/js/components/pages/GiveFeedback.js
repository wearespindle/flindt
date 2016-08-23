/*
  GiveFeedback
  <GiveFeedback/>
*/

import React from 'react';
import FeedbackList from '../feedback/as_sender/FeedbackList';

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
                    <FeedbackList {...this.props}/>
                </div>
            </div>
        );
    },
});

export default GiveFeedback;

/*
  GiveFeedback
  <GiveFeedback/>
*/

import React from 'react';
import FeedbackList from '../feedback/as_sender/FeedbackList';

const GiveFeedback = (props) =>

    <div className="content--wrapper">
        <div className="content--header">
            <div className="content--header-spacing" />
            <div className="content--header-breadcrumbs">
                <ul>
                    <li>Feedback geven</li>
                </ul>
            </div>
        </div>

        <div className="content">
            <FeedbackList {...props} />
        </div>
    </div>;

export default GiveFeedback;

/*
  FeedbackList
  <FeedbackList />
*/

import React from 'react';
import FeedbackRow from '../FeedbackRow';

class FeedbackList extends React.Component {
    componentWillMount() {
        this.props.fetchFeedbackAsReceiver();
    }

    render() {
        const { feedback, loading, error } = this.props.as_receiver_data;
        const { complete, incomplete } = feedback;

        if (loading || !complete) {
            return (
                <div>
                    <h2>Loading...</h2>
                    <div className="spinner">
                        <div className="bounce1" />
                        <div className="bounce2" />
                        <div className="bounce3" />
                    </div>
                </div>
            );
        }

        return (
            <div>
                <h2>Ontvangen Feedback</h2>

                <table>
                    <thead>
                        <tr>
                            <th>Persoon</th>
                            <th>Rol</th>
                            <th>Cirkel</th>
                            <th>Gekregen op</th>
                            <th>Acties</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            Object.keys(complete).map((key) =>
                                <FeedbackRow
                                  key={complete[key].id}
                                  index={key}
                                  details={complete[key]}
                                />
                            )
                        }
                    </tbody>
                </table>
            </div>
        );
    }
}

FeedbackList.propTypes = {
    fetchFeedbackAsReceiver: React.PropTypes.func,
    as_receiver_data: React.PropTypes.object,
    feedback: React.PropTypes.object,
};

export default FeedbackList;

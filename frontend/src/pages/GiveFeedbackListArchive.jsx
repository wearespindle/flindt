import React, { Component } from 'react';
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import ReactPaginate from 'react-paginate';

import { fetchFeedbackAsSender } from '../actions/feedback';
import FeedbackRow from '../components/FeedbackRow';
import Header from '../components/header';

class GiveFeedbackListArchive extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      offset: 0,
      limit: 8
    };

    this.handlePageClick = this.handlePageClick.bind(this);
  }

  componentWillMount() {
    let accessToken = this.props.user.user.access_token;
    let offset = this.state.offset;
    this.props
      .fetchFeedbackAsSender(accessToken, this.state.limit, offset)
      .then(response => {
        this.setState({
          pageCount: Math.ceil(response.payload.data.count / this.state.limit)
        });
      });
  }

  handlePageClick(data) {
    let selected = data.selected;
    let offset = Math.ceil(selected * this.state.limit);
    let accessToken = this.props.user.user.access_token;

    this.setState({ offset }, () => {
      this.props
        .fetchFeedbackAsSender(accessToken, this.state.limit, offset)
        .then(response => {
          this.setState({
            pageCount: Math.ceil(response.payload.data.count / this.state.limit)
          });
        });
    });
  }

  render() {
    if (!this.props.feedback.length) {
      return (
        <div className="content--wrapper">
          <div className="content--header">
            <Header />
            <div className="content--header-breadcrumbs">
              <ul>
                <li>Given feedback</li>
              </ul>
            </div>
          </div>

          {this.props.loading && (
            <div className="content">
              <div className="spinner">
                <div className="bounce1" />
                <div className="bounce2" />
                <div className="bounce3" />
              </div>
            </div>
          )}
          {!this.props.loading && (
            <div className="content is-text-center has-margin-top-100">
              <h3>
                This list is empty because you have not given feedback yet!
              </h3>
              <div className="content--no-feedback" />
            </div>
          )}
        </div>
      );
    }

    let complete = [];

    this.props.feedback.map(feedbackObject => {
      if (feedbackObject.status === 1) {
        complete.push(feedbackObject);
      }

      return null;
    });

    return (
      <div className="content--wrapper">
        <div className="content--header">
          <Header />
          <div className="content--header-breadcrumbs">
            <ul>
              <li>Given feedback archive</li>
            </ul>
          </div>
        </div>

        <div className="content">
          <div className="feedbacklist--wrapper">
            <h2>Given feedback</h2>

            <table>
              <thead>
                <tr>
                  <th>Person</th>
                  <th>Role</th>
                  <th>Circle</th>
                  <th>Given on</th>
                  <th>Rated</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {complete.map(completeObject => (
                  <FeedbackRow
                    key={completeObject.id}
                    index={completeObject.id}
                    details={completeObject}
                    completed
                  />
                ))}
              </tbody>
            </table>
          </div>
          {// Only show pagination if there are more than 1 pages.
          this.state.pageCount > 1 && (
            <ReactPaginate
              previousLabel={<i className="fa fa-chevron-left" />}
              nextLabel={<i className="fa fa-chevron-right" />}
              breakLabel={<a href="">...</a>}
              breakClassName={'break-me'}
              pageCount={this.state.pageCount}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={this.handlePageClick}
              containerClassName={'pagination'}
              subContainerClassName={'pages pagination'}
              activeClassName={'active'}
            />
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  feedback: state.Feedback.feedback_as_sender.feedback,
  numberOfFeedbackObjects: state.Feedback.feedback_as_sender.amount,
  loading: state.Feedback.feedback_as_sender.loading,
  user: state.User.data,
  user_data: state.User.user_data
});

GiveFeedbackListArchive.propTypes = {
  feedback: propTypes.array,
  fetchFeedbackAsSender: propTypes.func,
  user: propTypes.object,
  loading: propTypes.bool
};

export default connect(mapStateToProps, { fetchFeedbackAsSender })(
  GiveFeedbackListArchive
);

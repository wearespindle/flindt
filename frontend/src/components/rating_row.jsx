import React from 'react';

const RatingRows = ({remarks}) =>
    <div>
        {
            remarks.map((remark) => {
                const { rating } = remark;

                if (rating.name.toLowerCase() === 'positives') {
                    return (
                        <div key={rating.name} className="feedback-form--row">
                            <div className="l-5 feedback-form--row-smiley">
                                <img
                                  src="/dist/images/positive-feedback.png"
                                  alt="What is going well?"
                                />
                            </div>
                            <div className="l-43 feedback-content">
                                <h3>{rating.description}</h3>

                                <div key={remark.id}>
                                    <p>{remark.content}</p>
                                </div>
                            </div>
                        </div>
                    );
                }

                return (
                    <div key={rating.name} className="feedback-form--row">
                        <div className="l-5 feedback-form--row-smiley">
                            <img
                              src="/dist/images/negative-feedback.png"
                              alt="Are there any improvements?"
                            />
                        </div>
                        <div className="l-43 feedback-content">
                            <h3>{rating.description}</h3>

                            <div key={remark.id}>
                                <p>{remark.content}</p>
                            </div>
                        </div>
                    </div>
                );
            })
        }
    </div>;


RatingRows.propTypes = {
    remarks: React.PropTypes.array,
};

export default RatingRows;

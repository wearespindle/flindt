import React from 'react';
import propTypes from 'prop-types';

const RatingRows = ({remarks}) =>
    <div>
        {
            remarks.map((remark) => {
                const { rating } = remark;

                return (
                    <div key={rating.id} className="feedback-form--row">
                        <div className="feedback-form--answer-container">
                            { rating.image &&
                                <div className="l-5 feedback-form--row-smiley">
                                    <img alt="Rating" src={rating.image} />
                                </div>
                            }
                            <div className={`${(rating.image ? 'l-43' : '')}`}>
                                <strong>{rating.description}</strong>

                                <div className="feedback-form--answer" key={remark.id}>
                                    <p>{remark.content}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })
        }
    </div>;


RatingRows.propTypes = {
    remarks: propTypes.array,
};

export default RatingRows;

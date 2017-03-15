import React from 'react';

const RatingRows = ({remarks}) =>
    <div>
        {
            remarks.map((remark) => {
                const { rating } = remark;

                return (
                    <div key={rating.id} className="feedback-form--row">
                        { rating.image &&
                            <div className="l-5 feedback-form--row-smiley">
                                <img alt="Rating" src={rating.image} />
                            </div>
                        }
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

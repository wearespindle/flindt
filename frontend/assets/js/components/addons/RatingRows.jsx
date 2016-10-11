import React from 'react';

class RatingRows extends React.Component {
    render() {
        const { ratings, remarks } = this.props;

        let ratingRows = [];

        ratings.map((rating) => {
            let ratingObject = {
                description: rating.description,
                name: rating.name,
                items: [],
            };

            remarks.map((remark) => {
                if (remark.rating === rating.id) {
                    ratingObject.items.push(remark);
                }

                return true;
            });

            ratingRows.push(ratingObject);

            return true;
        });

        return (
            <div>
                {
                    ratingRows.map((ratingRow) => {
                        if (ratingRow.name.toLowerCase() === 'positive') {
                            return (
                                <div key={ratingRow.name} className="feedback-form--row">
                                    <div className="l-5 feedback-form--row-smiley">
                                        <img
                                          src="/compiled-assets/images/positive-feedback.png"
                                          alt="What is going well?"
                                        />
                                    </div>
                                    <div className="l-43 feedback-form--form">
                                        <h3>{ratingRow.description}</h3>

                                        {
                                            ratingRow.items.map((remark) =>
                                                <div key={remark.id}>
                                                    <p>{remark.content}</p>
                                                </div>
                                            )
                                        }
                                    </div>
                                </div>
                            );
                        }

                        return (
                            <div key={ratingRow.name} className="feedback-form--row">
                                <div className="l-5 feedback-form--row-smiley">
                                    <img
                                      src="/compiled-assets/images/negative-feedback.png"
                                      alt="Are there any improvements?"
                                    />
                                </div>
                                <div className="l-43 feedback-form--form">
                                    <h3>{ratingRow.description}</h3>

                                    {
                                        ratingRow.items.map((remark) =>
                                            <div key={remark.id}>
                                                <p>{remark.content}</p>
                                            </div>
                                        )
                                    }
                                </div>
                            </div>
                        );
                    })
                }
            </div>
        );
    }
}

RatingRows.propTypes = {
    ratings: React.PropTypes.array,
    remarks: React.PropTypes.array,
};

export default RatingRows;

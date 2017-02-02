import React from 'react';
import { shallow } from 'enzyme';
import RatingRows from '../../src/components/rating_row';

const testRemarks = [
    {
        content: 'First content',
        id: 1,
        rating: {
            description: 'First rating',
            id: 1,
            name: 'First content rating',
        },
    },
];

const component = shallow(<RatingRows remarks={testRemarks} />);

describe('The rating row component', () => {
    it('has remarks passed as a prop for rendering', () => {
        expect(component.props().remarks).toBe(testRemarks);
        expect(component.length).toBe(1);
    });
});

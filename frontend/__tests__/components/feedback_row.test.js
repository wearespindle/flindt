import React from 'react';
import { shallow } from 'enzyme';
import feedbackRow from '../../src/components/feedback_row';

const wrapper = shallow(<feedbackRow />);

describe('The feedback row component', () => {
    it('renders without going haywire', () => {
        expect(wrapper.length).toBe(1);
    });
});

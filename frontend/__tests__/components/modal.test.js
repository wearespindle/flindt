import React from 'react';
import { shallow } from 'enzyme';
import modal from '../../src/components/modal';

const wrapper = shallow(<modal />);

describe('The feedback row component', () => {
    it('renders without going haywire', () => {
        expect(wrapper.length).toBe(1);
    });
});

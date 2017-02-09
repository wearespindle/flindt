import React from 'react';
import TestUtils from 'react-addons-test-utils';
import {findDOMNode} from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { shallow } from 'enzyme';

import ModalButton from '../../src/components/modal_button';

// Redux mock stuff to test components that use redux connect() decorator.
const middleware = [];
const mockStore = configureStore();
const store = mockStore(middleware);

describe('Modal button component', () => {
    it('renders a modal button (anchor) with a role/circle name to click on', () => {
        const component = shallow(
            <Provider store={store}>
                <ModalButton accessToken="test123" role="2">
                    Front end
                </ModalButton>
            </Provider>
        );
        expect(component.props().children).toBeTruthy();
    });
});

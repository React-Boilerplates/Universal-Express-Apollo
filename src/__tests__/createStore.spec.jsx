/* eslint-env jest */
// import React from 'react';
// import { shallow } from 'enzyme';
import createStore from '../createStore';

describe('createStore', () => {
  it('should render', () => {
    const store = createStore({});

    expect(store).toBeDefined();
  });
});

/* eslint-env jest */
// import React from 'react';
// import { shallow } from 'enzyme';
import reducers from '../reducers';

describe('createStore', () => {
  it('should render', () => {
    const result = reducers(undefined, { type: 'ADD' });

    expect(result).toBeDefined();
    expect(result).toEqual(1);
  });
});

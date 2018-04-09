/* eslint-env jest */
import React from 'react';
import { shallow } from 'enzyme';
import Home from './Home';

describe('HomePage', () => {
  it('should render', () => {
    const post = shallow(<Home />);
    expect(post).toBeDefined();
  });
});

/* eslint-env jest */
import React from 'react';
import { shallow } from 'enzyme';
import App from './InnerPageLoader';

describe('App', () => {
  it('should render', () => {
    const post = shallow(<App />);
    expect(post).toBeDefined();
  });
});

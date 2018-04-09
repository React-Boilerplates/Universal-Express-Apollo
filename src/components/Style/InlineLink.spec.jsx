/* eslint-env jest */
import React from 'react';
import { shallow } from 'enzyme';
import App from './InlineLink';

describe('App', () => {
  it('should shallow render', () => {
    const post = shallow(<App />);
    expect(post).toBeDefined();
  });
});

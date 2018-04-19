/* eslint-env jest */
import React from 'react';
import { shallow } from 'enzyme';
import App from '../App';

global.console = {
  warn: jest.fn(),
  info: jest.fn(),
  log: jest.fn(),
  error: jest.fn()
};

describe('App', () => {
  it('should render', () => {
    const post = shallow(<App />);
    expect(post).toBeDefined();
  });
});

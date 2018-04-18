/* eslint-env jest */
import React from 'react';
import { shallow } from 'enzyme';
import fetch from 'isomorphic-unfetch'; // eslint-disable-line no-unused-vars
import App from '../App';

window.fetch = fetch;

describe('App', () => {
  it('should render', () => {
    shallow(<App />);
  });
});

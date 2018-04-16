/* eslint-env jest */
import React from 'react';
import { shallow } from 'enzyme';
import Home from './Home';
import HomePage from '.';

describe('HomePage', () => {
  it('should render', () => {
    const post = shallow(<Home />);
    expect(post).toBeDefined();
  });
  it('should async load', async () => {
    const App = await HomePage.load();
    const post = shallow(<App />);
    expect(post).toBeDefined();
  });
});

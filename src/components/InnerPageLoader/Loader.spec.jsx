/* eslint-env jest */
import React from 'react';
import { shallow } from 'enzyme';
import Loader from './InnerPageLoader';
import Import from '.';

describe('Loader', () => {
  it('should render', () => {
    const post = shallow(<Loader />);
    expect(post).toBeDefined();
  });
  it('should async load', async () => {
    const App = await Import.load();
    const post = shallow(<App />);
    expect(post).toBeDefined();
  });
});

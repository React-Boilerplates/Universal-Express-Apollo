/* eslint-env jest */
import React from 'react';
import { shallow } from 'enzyme';
import ErrorPage from './Error';
import Import from '.';

describe('ErrorPage', () => {
  it('should render', () => {
    const post = shallow(<ErrorPage />);
    expect(post).toBeDefined();
  });
  it('should async load', async () => {
    const App = await Import.load();
    const post = shallow(<App />);
    expect(post).toBeDefined();
  });
});

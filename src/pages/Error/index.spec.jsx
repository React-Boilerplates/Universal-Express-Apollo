/* eslint-env jest */
import React from 'react';
import { shallow } from 'enzyme';
import ErrorPage from './Error';

describe('ErrorPage', () => {
  it('should render', () => {
    const post = shallow(<ErrorPage />);
    expect(post).toBeDefined();
  });
});

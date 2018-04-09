/* eslint-env jest */
import React from 'react';
import { shallow } from 'enzyme';
import Error from './Error';

describe('ErrorPage', () => {
  it('should render', () => {
    const post = shallow(<Error />);
    expect(post).toBeDefined();
  });
});

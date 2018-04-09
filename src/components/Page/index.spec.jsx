/* eslint-env jest */
import React from 'react';
import { shallow } from 'enzyme';
import Page from './Page';

describe('Page', () => {
  it('should render', () => {
    const page = shallow(<Page />);
    expect(page).toBeDefined();
  });
});

/* eslint-env jest */
import React from 'react';
import { shallow } from 'enzyme';
import UserPage from './UserPage';

describe('UserPage', () => {
  it('should render', () => {
    const userPage = shallow(<UserPage match={{ params: { id: 123 } }} />);
    expect(userPage).toBeDefined();
  });
});

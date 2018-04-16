/* eslint-env jest */
import React from 'react';
import { shallow } from 'enzyme';
import UserPage, { User } from './UserPage';
import Import from '.';

describe('UserPage', () => {
  it('should render', () => {
    const userPage = shallow(<UserPage match={{ params: { id: 123 } }} />);
    expect(userPage).toBeDefined();
  });
  it('should render', () => {
    const userPage = shallow(<User user={{ name: 'Craig' }} />);
    expect(userPage).toBeDefined();
  });
  it('should async load', async () => {
    const App = await Import.load();
    const post = shallow(<App />);
    expect(post).toBeDefined();
  });
});

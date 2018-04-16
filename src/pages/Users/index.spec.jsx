/* eslint-env jest */
import React from 'react';
import { shallow } from 'enzyme';
import { Users } from './Users';
import Import from '.';

describe('Users', () => {
  it('should render', () => {
    const post = shallow(<Users users={{ edges: [] }} />);
    expect(post).toBeDefined();
  });
  it('should render', () => {
    const post = shallow(
      <Users
        users={{
          edges: [
            {
              node: { id: '1234', title: 'testing', author: { name: 'craig' } }
            }
          ]
        }}
      />
    );
    expect(post).toBeDefined();
  });
  it('should async load', async () => {
    const App = await Import.load();
    const post = shallow(<App />);
    expect(post).toBeDefined();
  });
});

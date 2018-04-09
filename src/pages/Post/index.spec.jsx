/* eslint-env jest */
import React from 'react';
import { shallow } from 'enzyme';
import { Post } from './Post';

describe('Post', () => {
  it('should render', () => {
    const post = shallow(
      <Post post={{ title: 'abc', author: { name: 'ME', id: '1234a' } }} />
    );
    expect(post).toBeDefined();
  });
});

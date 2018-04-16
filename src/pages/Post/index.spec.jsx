/* eslint-env jest */
import React from 'react';
import { shallow } from 'enzyme';
import { Post } from './Post';
import PostPage from '.';

describe('Post', () => {
  it('should render', () => {
    const post = shallow(
      <Post post={{ title: 'abc', author: { name: 'ME', id: '1234a' } }} />
    );
    expect(post).toBeDefined();
  });
  it('should async load', async () => {
    const App = await PostPage.load();
    const post = shallow(<App />);
    expect(post).toBeDefined();
  });
});

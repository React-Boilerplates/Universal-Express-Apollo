/* eslint-env jest */
import React from 'react';
import { shallow } from 'enzyme';
import { Posts } from './Posts';
import PostsPage from '.';

describe('Post', () => {
  it('should render', () => {
    const post = shallow(<Posts posts={{ edges: [] }} />);
    expect(post).toBeDefined();
  });
  it('should render', () => {
    const post = shallow(
      <Posts
        posts={{
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
    const App = await PostsPage.load();
    const post = shallow(<App />);
    expect(post).toBeDefined();
  });
});

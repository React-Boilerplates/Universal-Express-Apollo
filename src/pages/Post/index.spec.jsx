/* eslint-env jest */
import React from 'react';
import { shallow } from 'enzyme';
import Post from './Post';

describe('Post', () => {
  it('should render', () => {
    const post = shallow(<Post match={{ params: { id: '123' } }} />);
    expect(post).toBeDefined();
  });
});

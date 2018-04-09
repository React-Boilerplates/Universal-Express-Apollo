/* eslint-env jest */
import React from 'react';
import { shallow } from 'enzyme';
import App from './WayPoint';

class IntersectionObserver {
  constructor(func) {
    this.callback = func;
  }
  observe() {
    this.callback([{ isIntersecting: true }, { isIntersecting: false }]);
  }
}

global.IntersectionObserver = IntersectionObserver;

describe('App', () => {
  beforeAll(() => {
    global.IntersectionObserver = IntersectionObserver;
  });
  it('should shallow render', () => {
    const post = shallow(<App />);
    expect(post).toBeDefined();
  });
});

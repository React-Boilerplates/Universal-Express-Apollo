// import React from 'react';
// import { shallow } from 'enzyme';
import fetch from 'isomorphic-unfetch'; // eslint-disable-line no-unused-vars
import Html from '../Html';

describe('Server Html render', () => {
  it('should return a string', () => {
    expect(typeof Html()).toBe('string');
  });
});

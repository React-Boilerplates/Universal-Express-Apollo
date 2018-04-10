/* eslint-env jest */
/* global window */
import fetch from 'isomorphic-unfetch'; // eslint-disable-line no-unused-vars

window.__LOADABLE_STATE__ = {}; // eslint-disable-line no-underscore-dangle
const render = require('../.').default;

describe('Main Client', () => {
  it('should render', () => {
    render();
  });
});

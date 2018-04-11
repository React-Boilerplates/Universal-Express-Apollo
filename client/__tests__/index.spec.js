/* eslint-env jest */
/* global window, document */
import fetch from 'isomorphic-unfetch'; // eslint-disable-line no-unused-vars

// eslint-disable-next-line no-underscore-dangle
window.__LOADABLE_STATE__ = {
  children: [
    { id: './Helmet' },
    { id: './Home', children: [{ id: './PageErrorBoundary' }] }
  ]
};

window.location.pathname = '/';

const element = document.createElement('div');
element.setAttribute('id', 'root');
document.body.appendChild(element);

describe('Main Client', () => {
  it('should render', () => {
    // eslint-disable-next-line no-unused-expressions, global-require
    require('../.').default;
  });
});

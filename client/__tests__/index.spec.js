/* eslint-env jest */
/* global window, document */
import fetch from 'isomorphic-unfetch';
// eslint-disable-line no-unused-vars
jest.disableAutomock();
jest.mock('airbrake-js');
jest.mock('service-worker-loader!./sw');
// eslint-disable-next-line no-underscore-dangle
window.__LOADABLE_STATE__ = {
  children: [
    { id: './Helmet' },
    { id: './Home', children: [{ id: './PageErrorBoundary' }] }
  ]
};

global.console = {
  warn: jest.fn(),
  info: jest.fn(),
  log: jest.fn(),
  error: jest.fn()
};

window.fetch = fetch;

window.location.pathname = '/';

const element = document.createElement('div');
element.setAttribute('id', 'root');
document.body.appendChild(element);

describe('Main Client', () => {
  beforeEach(() => {
    jest.resetModules();
  });
  it('should render', () => {
    // eslint-disable-next-line no-unused-expressions, global-require
    require('../.').default;
  });
  it('should throw error in service worker', () => {
    require('../.').default;
  });
});

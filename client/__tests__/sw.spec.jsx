/* eslint-env jest */
/* eslint-disable no-restricted-globals, global-require */
/* globals self, Request */

const makeServiceWorkerEnv = require('service-worker-mock');

describe('Service Worker', () => {
  beforeEach(() => {
    jest.mock('babel-polyfill');
    // jest.resetAllMocks();
    Object.assign(global, makeServiceWorkerEnv());
    jest.resetModules();
  });
  it('should install', async () => {
    require('../sw.js');
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: jest.fn(() => ({ 'test.js': 'test' }))
      })
    );
    await self.trigger('install');
  });
  it('should fetch cached response when cached', async () => {
    require('../sw.js');
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: jest.fn(() => ({ 'test.js': 'test' }))
      })
    );
    const cachedResponse = { clone: () => {} };
    const cachedRequest = new Request('/test');

    const cache = await self.caches.open('dynamic-v1');
    cache.put(cachedRequest, cachedResponse);

    // Verify the response is the cachedResponse
    const response = await self.trigger('fetch', cachedRequest);
    expect(response).toBe(cachedResponse);
  });
  it('should fetch', async () => {
    require('../sw.js');
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: jest.fn(() => ({ 'test.js': 'test' }))
      })
    );
    const cachedRequest = new Request('/test');

    // Verify the response is the cachedResponse
    await self.trigger('fetch', cachedRequest);
    expect(global.fetch.mock.calls.length).toBe(1);
  });
  it('should fetch non-GET', async () => {
    require('../sw.js');
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: jest.fn(() => ({ 'test.js': 'test' }))
      })
    );
    const cachedRequest = new Request('/test', {
      method: 'POST'
    });

    // Verify the response is the cachedResponse
    await self.trigger('fetch', cachedRequest);
    expect(global.fetch.mock.calls.length).toBe(0);
  });
});

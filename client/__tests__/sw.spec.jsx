/* eslint-env jest */
/* eslint-disable no-restricted-globals, global-require */
/* globals self, Request */

const makeServiceWorkerEnv = require('service-worker-mock');

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: jest.fn(() => ({ 'test.js': 'test' }))
  })
);

describe('Service Worker', () => {
  beforeEach(() => {
    jest.mock('babel-polyfill');
    // jest.resetAllMocks();
    Object.assign(global, makeServiceWorkerEnv());
    jest.resetModules();
    global.cachedResponse = {
      body: { parts: [], type: '' },
      json() {
        return this.body;
      },
      clone() {
        return this;
      },
      headers: undefined,
      ok: true,
      redirected: false,
      status: 200,
      statusText: 'SuperSmashingGreat!',
      type: 'basic',
      url: 'http://example.com/asset'
    };
    global.cachedRequest = new Request(
      '/' + Math.round(Math.random * 10000000000)
    );
    global.__assets__ = '' + Math.random(); // eslint-disable-line no-unused-vars
    global.__dynamic__ = '' + Math.random(); // eslint-disable-line no-unused-vars
    require('../sw.js');
    global.fetch = jest.fn(() => Promise.resolve(global.cachedResponse));
  });
  it('should install', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: jest.fn(() => ({ 'test.js': 'test' }))
      })
    );
    await self.trigger('install');
  });
  it('should fetch cached response when cached', async () => {
    const cache = await self.caches.open(global.__dynamic__);
    await cache.put(global.cachedRequest.clone(), global.cachedResponse);
    // Verify the response is the cachedResponse
    const response = await self.trigger('fetch', global.cachedRequest);
    expect(response).toBe(global.cachedResponse);
  });
  it('should fetch', async () => {
    const cachedRequest = new Request('/test');

    // Verify the response is the cachedResponse
    await self.trigger('fetch', cachedRequest);
    expect(global.fetch.mock.calls.length).toBe(1);
  });
  it('should fetch non-GET', async () => {
    require('../sw.js');
    const cachedRequest = new Request('/test', {
      method: 'POST'
    });

    // Verify the response is the cachedResponse
    await self.trigger('fetch', cachedRequest);
    expect(global.fetch.mock.calls.length).toBe(0);
  });
});

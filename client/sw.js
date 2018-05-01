/* eslint-env serviceworker */
/* global fetch */
/* eslint-disable no-restricted-globals */
const ASSET_CACHE = 'assets-v1';
const DYNAMIC_CACHE = 'dynamic-v1';
const manifest = '/assets-manifest.json';

self.addEventListener('install', event => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(ASSET_CACHE);
      const assets = await fetch(manifest).then(response => response.json());
      await cache.addAll(
        Object.keys(assets)
          .filter(key => key !== 'sw.js')
          .map(key => assets[key])
      );
      const keys = await caches.keys();
      await keys
        .filter(key => key.includes('assets') && key !== ASSET_CACHE)
        .reduce(
          (promise, key) => promise.then(() => caches.delete(key)),
          Promise.resolve()
        );
      return self.skipWaiting();
    })()
  );
});

self.addEventListener('fetch', event => {
  // Always Pass NON-GET through for now
  if (event.request.method !== 'GET') return;
  if (event.request.url.includes('__webpack_hmr')) return;
  event.respondWith(
    (async function handleGet() {
      const [cache, keys] = await Promise.all([
        caches.open(DYNAMIC_CACHE),
        caches.keys()
      ]);
      const [cachedResponse] = await Promise.all([
        cache.match(event.request),
        ...keys
          .filter(key => key.includes('dynamic') && key !== DYNAMIC_CACHE)
          .map(key => caches.delete(key))
      ]);

      if (cachedResponse) {
        event.waitUntil(cache.add(event.request));
        return cachedResponse;
      }
      return fetch(event.request);
    })()
  );
});

/* eslint-env serviceworker */
/* global fetch */
import 'babel-polyfill';

const ASSET_CACHE = '1';
const DYNAMIC_CACHE = 'dynamic-v1';

self.addEventListener('install', event => {
  event.waitUntil(
    caches
      .open(ASSET_CACHE)
      .then(cache =>
        fetch('/assets-manifest.json')
          .then(response => response.json())
          .then(assets =>
            cache.addAll(
              Object.keys(assets)
                .filter(key => key !== 'sw.js')
                .map(key => assets[key])
            )
          )
      )
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('fetch', event => {
  // Always Pass GET through for now
  if (event.request.method !== 'GET') return;
  event.respondWith(
    (async function handleGet() {
      const cache = await caches.open(DYNAMIC_CACHE);
      const cachedResponse = await cache.match(event.request);

      if (cachedResponse) {
        event.waitUntil(cache.add(event.request));
        return cachedResponse;
      }
      return fetch(event.request);
    })()
  );
});

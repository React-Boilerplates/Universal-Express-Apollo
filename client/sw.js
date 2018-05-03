/* eslint-env serviceworker */
/* global fetch, __assets__, __dynamic__ */
/* eslint-disable no-restricted-globals */
import Dexie from 'dexie';
import md5 from 'blueimp-md5';

const ASSET_CACHE = __assets__;
const DYNAMIC_CACHE = __dynamic__;
// const OFFLINE_MUTATIONS = 'mutations-v1';
const manifest = '/assets-manifest.json';

const db = new Dexie('ServiceWorker');
db.version(1).stores({ queries: '++id,timestamp,hash, [hash+timestamp]' });

const handleGraphqlQuery = async (event, { hash, ...body }, response) => {
  console.log('QUERY');
  if (response.status >= 400) {
    // get cached response
    const { response: data } = await db.queries.get({ hash });
    // Potentially Check to see if it is too old and display this to the client
    const newResponse = new Response(...data);
    return newResponse;
  } else {
    const response2 = response.clone();
    response2.json().then(async json => {
      const init = {
        headers: [...response2.headers.entries()].reduce(
          (p, [key, value]) => ({ ...p, [key]: value }),
          {}
        ),
        status: response2.status,
        statusText: response2.statusText
      };

      return Promise.all([
        db.queries.put({
          ...body,
          hash,
          response: [JSON.stringify(json), init]
        }),
        db.queries
          .where('hash')
          .equals(hash)
          .and(value => value.timestamp < body.timestamp)
          .delete()
      ]);
    });

    return response;
  }
};

const handleGraphqlMutation = (event, body, response) => {
  console.log('MUTATION');
  return response;
};

const handleGraphQl = event => {
  // await db.queries.add(body);
  event.respondWith(
    (async () => {
      const req = event.request.clone();
      const [body, response] = await Promise.all([
        req.json(),
        fetch(event.request).catch(() => ({ status: 800000 }))
      ]);
      const timestamp = Date.now();
      const hash = md5(JSON.stringify(body));
      if (body.query.startsWith('query')) {
        return handleGraphqlQuery(
          event,
          { ...body, timestamp, hash },
          response
        );
      } else {
        return handleGraphqlMutation(
          event,
          { ...body, timestamp, hash },
          response
        );
      }
    })()
  );
};

async function handleStaticContent(event) {
  event.respondWith(
    (async () => {
      const cache = await caches.open(ASSET_CACHE);
      const cachedResponse = await cache.match(event.request.clone());
      if (!cachedResponse && navigator.onLine) {
        event.waitUntil(cache.add(event.request));
        return fetch(event.request);
      }
      return cachedResponse;
    })()
  );
}
function clearCaches(key) {
  return ![DYNAMIC_CACHE, ASSET_CACHE].includes(key);
}

self.addEventListener('install', event => {
  console.log('INSTALLING SERVICE WORKER');
  event.waitUntil(
    (async () => {
      const cache = await caches.open(ASSET_CACHE);
      const assets = await fetch(manifest).then(response => response.json());
      await cache.addAll(
        Object.keys(assets)
          .filter(key => key !== 'sw.js')
          .map(key => assets[key])
      );
      return self.skipWaiting();
    })()
  );
});

self.addEventListener('activate', event => {
  console.log('ACTIVATING SERVICE WORKER');
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await keys
        .filter(clearCaches)
        .reduce(
          (promise, key) => promise.then(() => caches.delete(key)),
          Promise.resolve()
        );
      return self.skipWaiting();
    })()
  );
});

self.addEventListener('message', async event => {
  if (event.data.type !== 'html') return;
  try {
    const url = new URL(event.data.path);
    const response = await fetch(url);
    const cache = await caches.open(DYNAMIC_CACHE);
    cache.put(url, response);
  } catch (error) {
    console.error(error);
  }
});

self.addEventListener('fetch', event => {
  if (event.request.url.includes('graphql')) return handleGraphQl(event);
  if (/\.hot-update\./.test(event.request.url)) return;
  // Always Pass NON-GET through for now
  if (event.request.method !== 'GET') return;
  if (/\.(css|json|js)/.test(event.request.url))
    return handleStaticContent(event);
  if (event.request.url.includes('__webpack_hmr')) return;
  console.log('REACHED HERE!!!');

  return event.respondWith(
    (async function handleGet() {
      console.log(DYNAMIC_CACHE);
      const cache = await caches.open(DYNAMIC_CACHE);
      const [cachedResponse, response] = await Promise.all([
        cache.match(event.request.clone()),
        fetch(event.request.clone()).catch(e => {
          console.error(e);
          return Promise.resolve();
        })
      ]);

      if (cachedResponse) {
        console.log('Cached Response Now!', event.request.url);
        console.log(response);
        if (response)
          event.waitUntil(cache.put(event.request.url, response.clone()));
        return cachedResponse;
      }
      console.log('No Cached Response');
      return response || new Response();
    })().catch(e => {
      console.error(e);
    })
  );
});

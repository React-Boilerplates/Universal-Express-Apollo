import assets from '../../assets.json';

const stringify = json => JSON.stringify(json).replace(/</g, '\\u003c');

export default (
  html,
  {
    title = '',
    headScript = '',
    bodyScript = '',
    bodyAttributes = '',
    meta = '',
    style = '',
    link = '',
    cache
  }
) => `
<!doctype html>
<html>
  <head>
    ${title}
    ${meta}
    ${link}
    ${style}
    ${headScript}
  </head>
  <body ${bodyAttributes}>
    <div id="root">${html}</div>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/16.3.0/cjs/react-dom-server.browser.production.min.js" integrity="sha256-kteFyrPGPZIASyU+pH5t9fyayICicvqTdfxbxRgp6bw=" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/react/16.3.0/cjs/react.production.min.js" integrity="sha256-NGhNLMxOmDYSTmpUlxspbliNB3L+zyhWvVzFerPjqso=" crossorigin="anonymous"></script>
    ${bodyScript}
    <script src="/${assets.vendor.js}"></script>
    <script>window.__APOLLO_STATE__ = ${stringify(cache.extract())}</script>
    <script src="/${assets.app.js}"></script>
  </body>
</html>
`;

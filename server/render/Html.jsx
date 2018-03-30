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
    ${process.env.HARD_CODED_SCRIPTS || ''}
    ${bodyScript}
    <script src="${assets.vendor.js}"></script>
    <script>window.__APOLLO_STATE__ = ${stringify(cache.extract())}</script>
    <script src="${assets.app.js}"></script>
  </body>
</html>
`;

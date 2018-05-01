import assets from '../../assets.json';

const stringify = json => JSON.stringify(json).replace(/</g, '\\u003c');

export default (
  html = '',
  {
    title = '',
    headScript = '',
    bodyScript = '',
    bodyAttributes = '',
    htmlAttributes = '',
    meta = '',
    style = '',
    link = '',
    amp = false,
    cache = false
  } = {}
) =>
  `
<!doctype html>
<html ${htmlAttributes}>
  <head>
    <meta charset="utf-8">
    ${
      amp
        ? '<script async src="https://cdn.ampproject.org/v0.js"></script>'
        : ''
    }
    ${title}
    ${meta}
    ${link}
    ${
      amp
        ? '<style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style><noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>'
        : ''
    }
    ${style}
    ${headScript}
  </head>
  <body ${bodyAttributes}>
    <div id="root">${html}</div>
    <script src="https://cdn.polyfill.io/v2/polyfill.min.js"></script>
    <script>window.AMP=${stringify(amp)};</script>
    ${process.env.HARD_CODED_SCRIPTS || ''}
    ${bodyScript}
    <script defer async src="${assets.vendor.js}"></script>
    ${
      cache
        ? `<script>window.__APOLLO_STATE__=${stringify(
            cache.extract()
          )};</script>`
        : ''
    }
    <script defer async src="${assets.app.js}"></script>
  </body>
</html>
`
    .replace(/  +/gm, ' ')
    .replace(/>\s+(?=<)/gm, '>');

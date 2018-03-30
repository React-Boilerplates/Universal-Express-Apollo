/* eslint-env node */
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { getDataFromTree } from 'react-apollo';
import { getLoadableState } from 'loadable-components/server';
import { Helmet } from 'react-helmet';
import { ServerStyleSheet } from 'styled-components';
import assets from '../assets.json';
import createClient from './client';

import App from './render/App';

const __DEV__ = process.env.NODE_ENV === 'development'; // eslint-disable-line no-underscore-dangle

const middleware = __DEV__
  ? require('./middleware/dev.js')
  : require('./middleware/prod.js');

const express = require('express');
require('dotenv').config();

const processPort = process.env.PORT;
const app = express();

require('./routes').default(app);

middleware(app);

app.get('*', (req, res) => {
  const client = createClient(req);
  const context = {};
  const appComponent = <App req={req} context={context} client={client} />;
  const sheet = new ServerStyleSheet();
  getLoadableState(appComponent).then(loadableState =>
    getDataFromTree(appComponent).then(() => {
      const html = ReactDOMServer.renderToString(
        sheet.collectStyles(appComponent)
      );
      const helmet = Helmet.renderStatic();
      const styles = sheet.getStyleTags();
      res.send(`
          <!doctype html>
          <html>
            <head>
              ${helmet.title.toString()}
              ${helmet.meta.toString()}
              ${helmet.link.toString()}
              ${styles}
            </head>
            <body ${helmet.bodyAttributes.toString()}>
              <script>window.__APOLLO_STATE__ = ${JSON.stringify(
          client.cache.extract()
        ).replace(/</g, '\\u003c')}</script>
              <div id="root">${html}</div>
              <script src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/16.3.0/cjs/react-dom-server.browser.production.min.js" integrity="sha256-kteFyrPGPZIASyU+pH5t9fyayICicvqTdfxbxRgp6bw=" crossorigin="anonymous"></script>
              <script src="https://cdnjs.cloudflare.com/ajax/libs/react/16.3.0/cjs/react.production.min.js" integrity="sha256-NGhNLMxOmDYSTmpUlxspbliNB3L+zyhWvVzFerPjqso=" crossorigin="anonymous"></script>
              <script src="/${assets.vendor.js}"></script>
              ${loadableState.getScriptTag()}
              <script src="/${assets.app.js}"></script>
            </body>
          </html>
        `);
    })
  );
});

app.listen(processPort, () =>
  console.log(`App 🚀 @ http://localhost:${processPort}/`)
);

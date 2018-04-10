/* eslint-env node */
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { getDataFromTree } from 'react-apollo';
import { getLoadableState } from 'loadable-components/server';
import { Helmet } from 'react-helmet';
import { ServerStyleSheet } from 'styled-components';
import fetch from 'isomorphic-unfetch';

import createStore from '../src/createStore';
import createClient from './client';
import Html from './render/Html';
import App from './render/App';

const { ApolloEngine } = require('apollo-engine');

const __DEV__ = process.env.NODE_ENV === 'development'; // eslint-disable-line no-underscore-dangle

const express = require('express');
// eslint-disable-next-line import/prefer-default-export
export const createServer = () => {
  const middleware = __DEV__
    ? require('./middleware/dev.js') // eslint-disable-line global-require
    : require('./middleware/prod.js'); // eslint-disable-line global-require
  const processPort = process.env.PORT;
  const app = express();

  middleware(app);
  // eslint-disable-next-line global-require
  require('./routes').default(app);

  app.get('*', (req, res, next) => {
    const client = createClient(req);
    const fullUrl = `${req.protocol}://${req.get('host')}`;
    const styleUrl = `${fullUrl}/assets/styles.css`; // canceling poor styling ``
    const amp = req.path.startsWith('/amp');
    const context = {};
    const store = createStore();
    const appComponent = (
      <App req={req} context={context} client={client} store={store} />
    );
    Promise.all([new ServerStyleSheet(), getLoadableState(appComponent)])
      .then(([sheet, loadableState]) =>
        Promise.all([
          amp
            ? fetch(styleUrl).then(response => response.text())
            : Promise.resolve(''),
          getDataFromTree(appComponent)
        ]).then(([style]) => {
          const html = ReactDOMServer.renderToString(
            sheet.collectStyles(appComponent)
          );
          const helmet = Helmet.renderStatic();
          const styles = sheet.getStyleTags();
          res.send(
            Html(html, {
              title: helmet.title.toString(),
              meta: helmet.meta.toString(),
              link: helmet.link.toString(),
              amp,
              path: req.path,
              style: `${styles}<style>${style}</style>`,
              htmlAttributes: helmet.htmlAttributes.toString(),
              bodyAttributes: helmet.bodyAttributes.toString(),
              bodyScript: `<script>window.__REDUX__ = ${JSON.stringify(
                store.getState()
              )}</script>${loadableState.getScriptTag()}`,
              cache: client.cache
            })
          );
        })
      )
      .catch(next);
  });
  let server;
  if (process.env.APOLLO_ENGINE_API_KEY) {
    const engine = new ApolloEngine({
      apiKey: process.env.APOLLO_ENGINE_API_KEY
    });

    // Call engine.listen instead of app.listen(port)
    server = engine.listen({
      port: 3000,
      expressApp: app
    });
  } else {
    server = app.listen(processPort, () => {
      console.log(`App 🚀  @ http://localhost:${processPort}/`);
    });
  }

  return server;
};
if (require.main === module) {
  // eslint-disable-next-line global-require
  require('dotenv').config();
  createServer();
}

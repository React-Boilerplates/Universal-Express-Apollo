/* eslint-env node */
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { getDataFromTree } from 'react-apollo';
import { getLoadableState } from 'loadable-components/server';
import { Helmet } from 'react-helmet';
import { ServerStyleSheet } from 'styled-components';
import createClient from './client';
import Html from './render/Html';

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
      res.send(
        Html(html, {
          title: helmet.title.toString(),
          meta: helmet.meta.toString(),
          link: helmet.link.toString(),
          style: styles,
          bodyAttributes: helmet.bodyAttributes.toString(),
          bodyScript: loadableState.getScriptTag(),
          cache: client.cache
        })
      );
    })
  );
});

app.listen(processPort, () =>
  console.log(`App 🚀 @ http://localhost:${processPort}/`)
);

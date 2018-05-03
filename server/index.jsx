/* eslint-disable import/no-extraneous-dependencies, node/no-missing-require */
/* eslint-env node */
import React from 'react';

import getPage from './render';
import logger from './logger';
import createStore from '../src/createStore';
import createClient from './client';
import Html from './render/Html';
import App from './render/App';
import { errorHandler } from './render/Error';

const { ApolloEngine } = require('apollo-engine');

const __DEV__ = process.env.NODE_ENV === 'development'; // eslint-disable-line no-underscore-dangle

const express = require('express');
// eslint-disable-next-line import/prefer-default-export
export const createServer = () => {
  const middleware = app =>
    __DEV__
      ? // eslint-disable-next-line node/no-unpublished-require
        require('./middleware/dev.js')(app) // eslint-disable-line global-require
      : require('./middleware/prod.js')(app); // eslint-disable-line global-require

  const app = express();

  middleware(app);

  app.get('*', (req, res, next) =>
    Promise.resolve().then(async () => {
      try {
        const amp = req.path.startsWith('/amp');
        const context = {};
        const client = createClient(req);
        const store = createStore();
        const page = await getPage({
          req,
          amp,
          client,
          component: (
            <App req={req} context={context} client={client} store={store} />
          )
        });

        return res.send(Html(...page));
      } catch (e) {
        return next(e);
      }
    })
  );
  app.use(errorHandler);
  let server;
  if (process.env.APOLLO_ENGINE_API_KEY) {
    server = {
      listen(port) {
        this.engine = new ApolloEngine({
          apiKey: process.env.APOLLO_ENGINE_API_KEY
        });
        this.engine.listen({
          port,
          expressApp: app
        });
        return this.engine;
      },
      close() {
        this.engine.close();
      }
    };
  } else {
    server = app;
  }

  return server;
};
export const startServer = (port, callback) => {
  const app = createServer();
  const server = app.listen(port, () => {
    logger.log(`App 🚀  @ http://localhost:${port}/`);
    if (callback) callback(server);
  });
  return server;
};
if (require.main === module) {
  const processPort = process.env.PORT;
  // eslint-disable-next-line global-require
  require('dotenv').config();
  startServer(processPort);
}

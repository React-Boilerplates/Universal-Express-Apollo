import morgan from 'morgan';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

const compression = require('compression');
const session = require('express-session');
const jwtMiddleware = require('express-jwt');
const jwt = require('jsonwebtoken');

const express = require('express');

const cookieSecret = process.env.COOKIE_SECRET;

const func = app => {
  console.log('Applying Production Middleware!');
  app.use(compression());
  app.use(
    express.static('public', {
      setHeaders: (res, path) => {
        if (path.match(/^.*\.[a-f0-9]{20}\..*$/m)) {
          res.set(
            'Cache-Control',
            'public, max-age=5259487, s-maxage=31536000'
          );
        } else {
          res.set('Cache-Control', 'public, max-age=0, s-maxage=172800');
        }
      }
    })
  );
  app.use(morgan('combined'));
  app.use(helmet());
  app.get('/jwt', (req, res) =>
    Promise.resolve()
      .then(() => jwt.sign({ id: 'bar' }, cookieSecret)) // Query a Session Store to provide this
      .then(token => res.json({ token }))
  );
  app.use(
    jwtMiddleware({
      secret: cookieSecret,
      credentialsRequired: false,
      getToken: function fromHeaderOrQuerystring(req) {
        if (
          req.headers.authorization &&
          req.headers.authorization.split(' ')[0] === 'Bearer'
        ) {
          return req.headers.authorization.split(' ')[1];
        } else if (req.query && req.query.token) {
          return req.query.token;
        }
        return null;
      }
    })
  );
  app.use(cookieParser(cookieSecret));
  app.use((req, res, next) => {
    if (req.user) return next();
    return session({
      secret: cookieSecret,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 30
      },
      name: 'boilerplate'
    })(req, res, next);
  });
  return app;
};

module.exports = func;

import morgan from 'morgan';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

const express = require('express');

const cookieSecret = process.env.COOKIE_SECRET;

const func = app => {
  console.log('Applying Production Middleware!');
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
  app.use(cookieParser(cookieSecret));
  return app;
};

module.exports = func;

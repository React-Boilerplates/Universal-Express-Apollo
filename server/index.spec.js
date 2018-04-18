/* eslint-env jest */
import 'jest-styled-components';
import request from 'supertest';
import { Helmet } from 'react-helmet';
import { __DO_NOT_USE_OR_YOU_WILL_BE_HAUNTED_BY_SPOOKY_GHOSTS as styledTools } from 'styled-components';

const op = require('openport');

process.env.COOKIE_SECRET = 'abc';
// process.env.PORT = 3002;
const server = require('.').createServer();

describe('Server', () => {
  beforeEach(() => {
    jest.resetModules();
    Helmet.canUseDOM = false;
    styledTools.StyleSheet.reset(true);
    jest.mock('twilio');
    jest.mock('@sendgrid/mail');
  });
  afterEach(() => {
    jest.resetModules();
    Helmet.canUseDOM = true;
    styledTools.StyleSheet.reset(false);
    jest.unmock('twilio');
    jest.unmock('@sendgrid/mail');
  });
  describe('production', () => {
    const env = process.env.NODE_ENV;
    beforeEach(() => {
      process.env.NODE_ENV = 'production';
    });
    it('should allow us to start', done => {
      op.find((err, port) =>
        // eslint-disable-next-line global-require
        require('.').startServer(port, innerServer => {
          done();
          innerServer.close();
        })
      );
    });
    afterEach(() => {
      process.env.NODE_ENV = env;
    });
  });

  describe('neither prod or dev', () => {
    const env = process.env.NODE_ENV;
    beforeEach(() => {
      process.env.NODE_ENV = 'test';
    });
    it('should allow us to start', done => {
      op.find((err, port) =>
        // eslint-disable-next-line global-require
        require('.').startServer(port, innerServer => {
          done();
          innerServer.close();
        })
      );
    });
    it('`/internal-graphiql` should return graphiql', async () => {
      const result = await request(server).get('/internal-graphiql');
      expect(result.text.includes('/graphiql.css"')).toBe(true);
      expect(result.status).toBe(200);
    });
    it('`/internal-graphql` should work', async () => {
      const result = await request(server)
        .post('/internal-graphql')
        .send({
          query: '{users{pageInfo{hasPreviousPage}}}'
        });
      expect(result.body).toEqual({
        data: { users: { pageInfo: { hasPreviousPage: false } } }
      });
      expect(result.statusCode).toBe(200);
    });
    afterEach(() => {
      process.env.NODE_ENV = env;
    });
  });

  describe('development', () => {
    const env = process.env.NODE_ENV;
    beforeEach(() => {
      process.env.NODE_ENV = 'development';
      jest.mock('webpack-hot-middleware');
      jest.mock('webpack-dev-middleware');
    });
    it('should allow us to start', done => {
      op.find((err, port) =>
        // eslint-disable-next-line global-require
        require('.').startServer(port, innerServer => {
          done();
          innerServer.close();
        })
      );
    });
    afterEach(() => {
      jest.unmock('webpack-hot-middleware');
      jest.unmock('webpack-dev-middleware');
      process.env.NODE_ENV = env;
    });
  });

  describe('/graphql', () => {
    beforeEach(() => {
      jest.resetModules();
      Helmet.canUseDOM = true;
      styledTools.StyleSheet.reset(false);
      jest.unmock('twilio');
      jest.unmock('@sendgrid/mail');
    });
    describe('query', () => {
      describe('users', () => {
        it('should always return hasPreviousPage', async () => {
          const result = await request(server)
            .post('/graphql')
            .send({
              query: '{users{pageInfo{hasPreviousPage}}}'
            });
          expect(result.statusCode).toBe(200);
          expect(result.body).toEqual({
            data: { users: { pageInfo: { hasPreviousPage: false } } }
          });
        });
      });
    });
    describe('mutation', () => {
      describe('signOn', () => {
        it('will reject users not in the system', async () => {
          const result = await request(server)
            .post('/graphql')
            .send({
              query:
                'mutation SignOn($email:String,$password:String){signOn(email:$email,password:$password){name}}',
              variables: {
                email: 'Craig@couture.com',
                password: 'String'
              }
            });

          expect(result.statusCode).toBe(200);
          expect(result.body.data).toEqual({
            signOn: null
          });
          expect(result.body.errors.length).toBe(1);
        });
      });
    });
  });
  describe('HTML', () => {
    it('`/` should return Home Page', async () => {
      const result = await request(server)
        .get('/')
        .expect(200);
      expect(result.text.includes('{"id":"./Home",')).toBe(true);
      expect(result.status).toBe(200);
    });
    it('`/graphiql` should return graphiql', async () => {
      const result = await request(server).get('/graphiql');
      expect(result.text.includes('/graphiql.css"')).toBe(true);
      expect(result.status).toBe(200);
    });
  });
});

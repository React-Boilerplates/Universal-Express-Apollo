/* eslint-env jest */
import 'jest-styled-components';
import request from 'supertest';
import { Helmet } from 'react-helmet';
import { __DO_NOT_USE_OR_YOU_WILL_BE_HAUNTED_BY_SPOOKY_GHOSTS as styledTools } from 'styled-components';

process.env.COOKIE_SECRET = 'abc';
process.env.PORT = 3002;
const server = require('.').createServer();

describe.only('Server', () => {
  beforeEach(() => {
    jest.resetModules();
    Helmet.canUseDOM = false;
    styledTools.StyleSheet.reset(true);
  });
  afterEach(() => {
    jest.resetModules();
    Helmet.canUseDOM = true;
    styledTools.StyleSheet.reset(false);
  });
  it('should allow us to start', () => {
    try {
      const innerServer = require('.').startServer(
        Math.round(Math.random() * 5000)
      );
      setTimeout(() => {
        innerServer.close();
      }, 2000);
      // innerServer.close();
    } catch (e) {
      console.log(e);
    }
  });

  it('should test express', async () => {
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
  it('should test express', async () => {
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
  it('should test express', async () => {
    const result = await request(server)
      .get('/')
      .expect(200);
    expect(result.text.includes('{"id":"./Home",'));
    expect(result.status).toBe(200);
  });
});

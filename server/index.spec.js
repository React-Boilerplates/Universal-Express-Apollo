/* eslint-env jest */
import chai from 'chai';
import webpack from 'webpack';
import chaiHttp from 'chai-http';

import config from '../tools/webpack/development.client';

chai.use(chaiHttp);

global.server = undefined;

describe.only('Server', () => {
  beforeAll(done => {
    process.env.COOKIE_SECRET = 'abc';
    process.env.PORT = 3001;
    webpack(config, err => {
      if (err) console.log(err);
      // eslint-disable-next-line global-require
      global.server = require('.').createServer();
      done();
    });
  });
  beforeEach(() => {
    jest.resetModules();
  });
  it('should test express', done => {
    chai
      .request(global.server)
      .post('/graphql')
      .send({
        query: '{users{pageInfo{hasPreviousPage}}}'
      })
      .end((err, res) => {
        expect(err).toBe(null);
        expect(res.body).toEqual({
          data: { users: { pageInfo: { hasPreviousPage: false } } }
        });
        done();
      });
  });
  it('should test express', done => {
    chai
      .request(global.server)
      .post('/graphql')
      .send({
        query:
          'mutation SignOn($email:String,$password:String){signOn(email:$email,password:$password){name}}',
        variables: {
          email: 'Craig@couture.com',
          password: 'String'
        }
      })
      .end((err, res) => {
        expect(err).toBe(null);
        expect(res.body.data).toEqual({
          signOn: null
        });
        expect(res.body.errors.length).toBe(1);
        done();
      });
  });
  it('should test express', done => {
    jest.mock('styled-components');
    // StyleSheet.reset(true);
    chai
      .request(global.server)
      .get('/')
      .end((err, res) => {
        // console.log(res.text);
        expect(res.text.startsWith('<!DOCTYPE html>'));
        jest.unmock('styled-components');
        // expect(res.status).toBe(200);
        done();
      });
  });
});

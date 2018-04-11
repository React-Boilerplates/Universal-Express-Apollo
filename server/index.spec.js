/* eslint-env jest */
import chai from 'chai';
// import webpack from 'webpack';
import chaiHttp from 'chai-http';

// import config from '../tools/webpack/base.testing';

chai.use(chaiHttp);
process.env.COOKIE_SECRET = 'abc';
process.env.PORT = 3001;
const server = require('.').createServer();

describe.only('Server', () => {
  beforeEach(() => {
    jest.resetModules();
  });
  it('should test express', done => {
    chai
      .request(server)
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
      .request(server)
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
      .request(server)
      .get('/')
      .end((err, res) => {
        server.close();
        // console.log(res.text);
        expect(res.text.startsWith('<!DOCTYPE html>'));
        jest.unmock('styled-components');
        // expect(res.status).toBe(200);
        done();
      });
  });
});

/* eslint-env jest */
import 'jest-styled-components';
import chai from 'chai';
import chaiHttp from 'chai-http';

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
    jest.mock('react-helmet');
    // StyleSheet.reset(true);
    chai
      .request(server)
      .get('/')
      .end((err, res) => {
        server.close();
        // console.log(res.text);
        expect(res.text.startsWith('<!DOCTYPE html>'));
        console.log(res.text);
        jest.unmock('styled-components');
        jest.unmock('react-helmet');
        // expect(res.status).toBe(200);
        done();
      });
  });
});

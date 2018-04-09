/* eslint-env jest */

jest.mock('express', () => {
  const result = jest.fn(() => ({
    use: jest.fn((jest.fn, jest.fn)),
    get: jest.fn((jest.fn, jest.fn)),
    listen: jest.fn((jest.fn, jest.fn))
  }));
  result.static = jest.fn((jest.fn, jest.fn));
  return result;
});

process.env.COOKIE_SECRET = 'abc';
describe.skip('Server', () => {
  it('should test express', () => {
    require('.'); // eslint-disable-line global-require
  });
});

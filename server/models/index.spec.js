/* eslint-env jest */

process.env.COOKIE_SECRET = 'abc';
describe('Sequelize', () => {
  it('should test production', async () => {
    process.env.NODE_ENV = 'production';
    const db = await require('.').default(); // eslint-disable-line global-require
    expect(db.relationships).toBeDefined();
  });
  it('should test development', async () => {
    process.env.NODE_ENV = 'development';
    const db = await require('.').default(); // eslint-disable-line global-require
    expect(db.relationships).toBeDefined();
  });
});

/* eslint-env jest */
// const openport = require('openport');
const puppeteer = require('puppeteer');
const { spawn, exec } = require('child_process');

describe('E2E', () => {
  describe('development', () => {
    let page;
    let port;
    let server;
    let browser;
    beforeAll(async () => {
      server = spawn('npm start', ['PORT=3000']);

      browser = await puppeteer.launch();
      page = await browser.newPage();
    });

    it('should display "Universal React Starter" text on home page', async () => {
      await page.goto(`http://localhost:${port || 3000}/`);
      await expect(await page.content()).toMatch('Universal React Starter');
    });
    afterAll(async () => {
      port = undefined;
      await browser.close();
      server.kill();
    });
  });
  describe('production', () => {
    let page;
    let port;
    let server;
    let browser;
    beforeAll(done => {
      jest.setTimeout(20000);
      exec('npm run build', async err => {
        if (err) console.error(err);
        server = spawn('npm run start:prod');
        browser = await puppeteer.launch();
        page = await browser.newPage();
        done();
      });
    });

    it('should display "Universal React Starter" text on home page', async () => {
      await page.goto(`http://localhost:${port || 3000}/`);
      await expect(await page.content()).toMatch('Universal React Starter');
    });
    afterAll(async () => {
      port = undefined;
      await browser.close();
      server.kill();
    });
  });
});

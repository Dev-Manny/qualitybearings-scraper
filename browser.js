const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

async function startBrowser() {
  let browser;
  try {
    console.log('Opening the browser...');
    browser = await puppeteer.launch({
      headless: false,
      args: ['--disable-setuid-sandbox'],
      ignoreHTTPSErrors: true,
    });
  } catch (e) {
    console.log('could not create a browser instance => ', e);
  }

  return browser;
}

module.exports = {
  startBrowser,
};

const puppeteer = require('puppeteer');

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

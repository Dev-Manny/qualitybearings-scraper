const pageScraper = require('../scrapers/motionIndustryScraper');

const exportDataToCSV = require('../services/export_service');

const filePath = './src/output/motionindustry.csv';

async function scrapeAll(browserInstance) {
  try {
    browser = await browserInstance;
    const scrapedData = await pageScraper.scraper(browser);

    await browser.close();

    exportDataToCSV(scrapedData, filePath);
  } catch (e) {
    console.log('could not resolve the browser instance =>', e);
  }
}

module.exports = (browserInstance) => scrapeAll(browserInstance);

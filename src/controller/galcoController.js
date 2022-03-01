const pageScraper = require('../scrapers/galcoScraper');

const exportDataToCSV = require('../services/export_service');

const filePath = './src/output/galco.csv';

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

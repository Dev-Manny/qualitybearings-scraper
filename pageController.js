const pageScraper = require("./flowdrillListScraper");

const exportDataToExcel = require("./exportService");

const workSheetColumnNames = [
  'description',
  'additional_description',
  'Name',
  'Article code',
  'Thread type',
  'Thread size',
  'Diameter',
  'Pitch',
  'Shank Diameter',
  'Square diameter',
];

const workSheetName = "File";
const filePath = "./exel-from.xlsx";

async function scrapeAll(browserInstance) {
  try {
    browser = await browserInstance;
    const scrapedData = await pageScraper.scraper(browser);
    await browser.close();
    exportDataToExcel(
      scrapedData,
      workSheetColumnNames,
      workSheetName,
      filePath
    );
  } catch (e) {
    console.log("could not resolve the browser instance =>", e);
  }
}

module.exports = (browserInstance) => scrapeAll(browserInstance);

const pageScraper = require("./baldorScraper");

const exportDataToExcel = require("./exportService");

const workSheetColumnNames = [
  "brand",
  "productID",
  "insideDiameter",
  "OutsideDiameter",
  "width",
  "cageType",
  "clearance",
];

const workSheetName = "Task";
const filePath = "./exel-from.xlsx";

async function scrapeAll(browserInstance) {
  try {
    browser = await browserInstance;
    const scrapedData = await pageScraper.scraper(browser);
    console.log('ending');
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

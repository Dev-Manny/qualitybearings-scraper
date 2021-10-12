const pageScraper = require("./abbScraper");

const exportDataToExcel = require("./exportService");

const workSheetColumnNames = [
  "Bore Size/Inside Diameter",
  "Casting Material",
  "Keyway Size",
  "Product ID",
  "Bushing Size",
  "Bushing Length/Outside Diameter"
];

const workSheetName = "Task";
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

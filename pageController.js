const pageScraper = require("./baldorScraper");

const exportDataToExcel = require("./exportService");

const workSheetColumnNames = [
  "Bore Size",
  "Casting Material",
  "Keyway Size",
  "Product ID",
  "Bushing Size",
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

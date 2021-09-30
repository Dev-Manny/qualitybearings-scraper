const pageScraper = require("./flowdrillScraper");

const exportDataToExcel = require("./exportService");

const workSheetColumnNames = [
  "Product Name",
  "Product SKU",
  "Product Description",
  "Product Additional Description",
  "Diameter",
  "Article Code",
  "Thread Type",
  "Thread Size",
  "Min Material Thickness",
  "Max Material Thinckness",
  "Finishing",
  "Shaft Diameter",
  "Work Length",
  "Material 1",
  "Spindle Speed",
  "Feed",
  "Power",
  "Material 2",
  "Spindle Speed 2",
  "Feed 2",
  "Power 2"
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

const pageScraper = require("./dodgeScraper");

const exportDataToExcel = require("./exportService");

const workSheetColumnNames = [
  'Product ID',
  'Bearing Type',
  'Shaft Attachment',
  'Housing Construction',
  'Insert Material',
  'Expansion Capability',
  'Housing Dimensional Standard',
  'Sensor Ready',
  'Suitable for Washdown Environment',
  'Housing Type',
  'Sealing Type',
  'Relubricatable',
  'Lubrication',
  'Grease Name',
  'Suitable for High Temperature Application',
  'Dynamic Load Capacity',
  'Maximum Speed',
  'Static Load Capacity',
  'Shaft Diameter',
  'Standoff Included',
  'Bore Length',
  'Insert Outer Diameter',
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

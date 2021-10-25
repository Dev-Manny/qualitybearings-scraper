const pageScraper = require("./aimBearingScraper");

const exportDataToExcel = require("./exportService");

const workSheetColumnNames = [
  'Product ID',
  'Shaft Diameter',
  'Dynamic Load Rating',
  'Static Load Rating',
  'Weight',
  'D',
  'U',
  'B',
  'C',
  'L',
  'Bi',
  'Be',
  'r',
  'R',
  'n',
  'N',
  'm',
  'M',
  'G',
  'Z',
  'O',
  'T',
  'Y Max',
  'Y',
  'W',
  'an',
  'A',
  'J',
  'K',
  'ds',
  'o'
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

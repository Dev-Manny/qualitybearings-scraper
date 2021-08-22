const pageScraper = require("./skfScraper");

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
    /// console.log(scrapedData);
    await browser.close();
    exportDataToExcel(
      scrapedData,
      workSheetColumnNames,
      workSheetName,
      filePath
    );
    // fs.writeFile(
    //   "data.json",
    //   JSON.stringify(scrapedData),
    //   "utf-8",
    //   function (err) {
    //     if (err) {
    //       return console.log(err);
    //     }
    //     console.log("Dtata scraped");
    //   }
    // );
  } catch (e) {
    console.log("could not resolve the browser instance =>", e);
  }
}

module.exports = (browserInstance) => scrapeAll(browserInstance);

const csvToArray = require('../services/csv_array');

const santaClaraScraperObject = {
  async scraper(browser) {
    //stores all scrapped data
    let scrapedData = [];

    // opens a new browser
    let newPage = await browser.newPage();

    async function scrapeCurrentPage() {
      const catalogs = await csvToArray('Enerpac');

      let pagePromise = (link, prodId) =>
        new Promise(async (resolve, reject) => {
          let dataObj = {};

          // waits for the link to be opened
          await newPage.goto(link, { waitUntil: 'load', timeout: 50000 });

          await newPage.click(
            '#header > div.header-inner > div.row > div.col-xs-9 > div'
          );

          await newPage.waitForSelector('input[id=mobile-search]');

          await newPage.type('#mobile-search', prodId);

          await newPage.keyboard.press('Enter');
          await newPage.waitForSelector('#mobile-arrow');

          // check if product exists
          let check = await newPage.$('.top-info');

          if (check === null) {
            dataObj['product_id'] = prodId;
            dataObj['image'] = '';
            resolve(dataObj);
            return;
          }
          await newPage.waitForSelector('.top-info');

          let [chkProd] = await newPage.$x(
            '//*[@id="maincontent"]/div/div[3]/div[2]/table[1]/tbody/tr[1]/td[1]/span'
          );

          if (typeof (await chkProd) === 'undefined') {
            dataObj['product_id'] = prodId;
            dataObj['image'] = '';
            resolve(dataObj);
            return;
          }

          chkProd = await chkProd.getProperty('textContent');
          chkProd = await chkProd.jsonValue();

          if (chkProd !== prodId) {
            dataObj['product_id'] = prodId;
            dataObj['image'] = '';
            resolve(dataObj);
            return;
          }

          let [prodImage] = await newPage.$x('//*[@id="ZoomOpener"]');

          prodImage = await prodImage.getProperty('src');

          prodImage = (await prodImage.jsonValue()).trim();

          dataObj['product_id'] = prodId;
          dataObj['image'] = prodImage;

          resolve(dataObj);
          // await newPage.close();
        });

      for (id in catalogs) {
        if (catalogs[id] != null) {
          let currentPageData = await pagePromise(
            `https://www.connectorspecialists.com`,
            catalogs[id]
          );
          console.log(id, ' got', catalogs[id]);
          scrapedData.push(currentPageData);
        }
      }

      await newPage.close();
      return scrapedData;
    }

    let data = await scrapeCurrentPage();

    return data;
  },
};

module.exports = santaClaraScraperObject;

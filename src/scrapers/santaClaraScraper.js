const csvToArray = require('../services/csv_array');
const santaClaraScraperObject = {
  async scraper(browser) {
    //stores all scrapped data
    let scrapedData = [];

    // opens a new browser
    let newPage = await browser.newPage();

    async function scrapeCurrentPage() {
      const catalogs = await csvToArray('aim');

      let pagePromise = (link, prodId) =>
        new Promise(async (resolve, reject) => {
          let dataObj = {};

          // waits for the link to be opened
          await newPage.goto(link, { waitUntil: 'load', timeout: 50000 });

          await newPage.waitForXPath(
            '//*[@id="catalog-hits"]/div/div[3]/div/a'
          );

          let [prodLink] = await newPage.$x(
            '//*[@id="catalog-hits"]/div/div[3]/div/a'
          );

          prodLink = await prodLink.getProperty('href');

          prodLink = await prodLink.jsonValue();

          await newPage.goto(prodLink, { waitUntil: 'load', timeout: 50000 });

          let [chkProd] = await newPage.$x(
            '//*[@id="catalog"]/div/div[3]/div[2]/div[3]/div[2]/h1'
          );
          chkProd = await chkProd.getProperty('textContent');
          chkProd = await chkProd.jsonValue();

          if (prodId !== chkProd) {
            dataObj['product_id'] = prodId;
            dataObj['description'] = '';
            resolve(dataObj);
            return;
          }

          let [description] = await newPage.$x(
            '//*[@id="catalog"]/div/div[3]/div[2]/div[4]/div[1]/div[1]/div/div/div[1]/ul/li/span'
          );

          if (typeof (await description) === 'undefined') {
            dataObj['product_id'] = prodId;
            dataObj['description'] = '';
            resolve(dataObj);
            return;
          }
          description = await description.getProperty('textContent');
          description = await description.jsonValue();

          dataObj['product_id'] = prodId;
          dataObj['description'] = description;

          resolve(dataObj);
          // await newPage.close();
        });

      for (id in catalogs) {
        if (catalogs[id] != null) {
          let currentPageData = await pagePromise(
            `https://www.santaclarasystems.com/en-gb/search?#q=${catalogs[id]}*`,
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

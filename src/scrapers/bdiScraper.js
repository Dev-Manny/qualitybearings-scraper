const csvToArray = require('../services/csv_array');
let userAgent = require('user-agents');

const texasBeltingScraperObject = {
  async scraper(browser) {
    let scrapedData = [];
   

    async function scrapeCurrentPage() {
      //const catalogs = await csvToArray('Gates Rubber Image');

      let catalogs = ['LER53X0215-G-A', '61822-Y', '6206-C-2HRS-L038'];

      let pagePromise = (link, prodId) =>
        new Promise(async (resolve, reject) => {
          let dataObj = {};

          await newPage.goto(link, { waitUntil: 'load', timeout: 50000 });

          await newPage.waitForSelector('#main', { timeout: 500000 });

          let [checkProd] = await newPage.$x('//*[@id="PLP_PartNumber1"]');
          checkProd = await checkProd.getProperty('textContent');
          checkProd = await checkProd.jsonValue();
          if (checkProd === 'No products') {
            dataObj['product_id'] = prodId;
            dataObj['image'] = '';
            resolve(dataObj);
            return;
          }

          // remove all special characters
          checkProd = checkProd.replace(/[^\w\s]/gi, '');
          prodId = prodId.replace(/[^\w\s]/gi, '');

          if (!checkProd.includes(prodId)) {
            dataObj['product_id'] = prodId;
            dataObj['image'] = '';
            resolve(dataObj);
            return;
          }

          let [prodImage] = await newPage.$x('//*[@id="PLP_Product_Name1"]/a');

          prodImage = await prodImage.getProperty('href');
          prodImage = await prodImage.jsonValue();

          dataObj['product_id'] = prodId;
          dataObj['image'] = prodImage;

          resolve(dataObj);
          await newPage.close();
        });

      for (id in catalogs) {
        if (catalogs[id] != null) {
          let currentPageData = await pagePromise(
            `https://www.bdiexpress.com/us/en/search?searchBy=ALL&q=${catalogs[id]}&fromcf=true`,
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

module.exports = texasBeltingScraperObject;

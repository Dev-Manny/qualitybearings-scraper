const csvToArray = require('../services/csv_array');

const galcoScraperObject = {
  async scraper(browser) {
    let scrapedData = [];
    let newPage = await browser.newPage();

    async function scrapeCurrentPage() {
      const catalogs = await csvToArray('galco');

      let pagePromise = (link, prodId) =>
        new Promise(async (resolve, reject) => {
          let dataObj = {};

          await newPage.goto(link, { waitUntil: 'load', timeout: 70000 });

          await newPage.waitForSelector('#shop');

          let [numProd] = await newPage.$x('//*[@id="partdiv1"]/div[2]');

          if (typeof (await numProd) === 'undefined') {
            dataObj['product_id'] = prodId;
            dataObj['image'] = '';
            resolve(dataObj);
            return;
          }

          let [checkProd] = await newPage.$x(
            '//*[@id="partdiv1"]/div[2]/div[2]/div[2]/div[1]/div[2]/div/span[2]/a'
          );

          checkProd = await checkProd.getProperty('textContent');
          checkProd = await checkProd.jsonValue();

          let newCheckProd = checkProd.replace(/[^A-Z0-9]/gi, '');
          let newProdId = prodId.replace(/[^A-Z0-9]/gi, '');

          if (!newCheckProd.includes(newProdId)) {
            dataObj['product_id'] = prodId;
            dataObj['image'] = '';
            resolve(dataObj);
            return;
          }

          let [prodImage] = await newPage.$x(
            '//*[@id="partdiv1"]/div[2]/div[1]/div[1]/a/img'
          );
          prodImage = await prodImage.getProperty('src');
          prodImage = await prodImage.jsonValue();

          console.log(prodImage);
          if (
            prodImage === 'https://www.galco.com/images/catalog/picture-na.jpg'
          ) {
            prodImage = '';
          }
          dataObj['product_id'] = prodId;
          dataObj['image'] = prodImage;

          resolve(dataObj);
          // await newPage.close();
        });

      for (id in catalogs) {
        if (catalogs[id] != null) {
          let currentPageData = await pagePromise(
            `https://www.galco.com/scripts/cgiip.exe/wa/wcat/catalog.htm?searchbox=${catalogs[id]}`,
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

module.exports = galcoScraperObject;

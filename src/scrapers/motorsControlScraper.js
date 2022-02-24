const csvToArray = require('../services/csv_array');

const motorsControlScraperObject = {
  async scraper(browser) {
    let scrapedData = [];
    let newPage = await browser.newPage();

    async function scrapeCurrentPage() {
      const catalogs = await csvToArray('StearnsSix');
      //let catalogs = [];

      let pagePromise = (link, prodId) =>
        new Promise(async (resolve, reject) => {
          let dataObj = {};

          await newPage.goto(link, { waitUntil: 'load', timeout: 50000 });

          await newPage.waitForSelector('#maincontent');

          let [checkProd] = await newPage.$x(
            '//*[@id="maincontent"]/div[3]/div[1]/div[3]/ol/li/div/div[2]/div[1]/div[1]/div/span[4]'
          );

          if (typeof (await checkProd) === 'undefined') {
            dataObj['product_id'] = prodId;
            dataObj['image'] = '';
            resolve(dataObj);
            return;
          }
          checkProd = await checkProd.getProperty('textContent');
          checkProd = await checkProd.jsonValue();

          let newCheckProd = checkProd.replace(/[^A-Z0-9]/gi, '');
          let newProdId = prodId.replace(/[^A-Z0-9]/gi, '');

          console.log(newCheckProd);
          console.log(newProdId);

          if (!newCheckProd.includes(newProdId)) {
            dataObj['product_id'] = prodId;
            dataObj['image'] = '';
            resolve(dataObj);
            return;
          }

          let [prodImage] = await newPage.$x(
            '//*[@id="maincontent"]/div[3]/div[1]/div[3]/ol/li/div/div[1]/a/img'
          );
          prodImage = await prodImage.getProperty('src');
          prodImage = await prodImage.jsonValue();

          if (
            prodImage ===
            'https://motorsandcontrol.com/media/catalog/product/cache/f6b4c66cd38827c69071dcda4f9968da/s/t/stearns_brake_logo_2019.jpg'
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
            `https://motorsandcontrol.com/catalogsearch/result/?q=${catalogs[id]}`,
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

module.exports = motorsControlScraperObject;

const csvToArray = require('../services/csv_array');

const bearingModelScraperObject = {
  async scraper(browser) {
    let scrapedData = [];
    let newPage = await browser.newPage();

    async function scrapeCurrentPage() {
      const catalogs = await csvToArray('FAG Bearing');

      let pagePromise = (link, prodId) =>
        new Promise(async (resolve, reject) => {
          let dataObj = {};
          let image = '';

          await newPage.goto(link, { waitUntil: 'load', timeout: 50000 });

          await newPage.waitForSelector('.container-fluid');

          let [itemList] = await newPage.$x(
            '/html/body/div[1]/div/div[3]/div[2]'
          );
          itemList = await itemList.getProperty('children');
          itemList = await (await itemList.getProperty('length')).jsonValue();

          if (itemList < 1) {
            dataObj['product_id'] = prodId;
            dataObj['image'] = '';
            resolve(dataObj);
            return;
          }

          itemList /= 2;

          // loop through the items
          for (i = 1; i <= itemList; i++) {
            let q = `/html/body/div[1]/div/div[3]/div[2]/ul[${i}]/li[1]`;

            let [prodName] = await newPage.$x(q);
            prodName = await prodName.getProperty('textContent');
            prodName = await prodName.jsonValue();

            prodName = prodName.replace(/[^\w\s]/gi, '');
            prodId = prodId.replace(/[^\w\s]/gi, '');

            if (prodName === `FAG ${prodId}`) {
              let [prodLink] = await newPage.$x(
                `/html/body/div[1]/div/div[3]/div[2]/ul[${i}]/li[1]/b/a`
              );
              prodLink = await prodLink.getProperty('href');
              prodLink = await prodLink.jsonValue();

              await newPage.goto(prodLink, {
                waitUntil: 'load',
                timeout: 50000,
              });

              let [prodImage] = await newPage.$x(
                '//*[@id="flexslider"]/ul[1]/li/img'
              );

              if (typeof (await prodImage) === 'undefined') {
                dataObj['product_id'] = prodId;
                dataObj['image'] = '';
                resolve(dataObj);
                return;
              }

              prodImage = await prodImage.getProperty('src');
              if (typeof (await prodImage) === 'undefined') {
                dataObj['product_id'] = prodId;
                dataObj['image'] = '';
                resolve(dataObj);
                return;
              }
              image = await prodImage.jsonValue();

              console.log(image);

              dataObj['product_id'] = prodId;
              dataObj['image'] = image;
              resolve(dataObj);
              return;
            }
          }

          dataObj['product_id'] = prodId;
          dataObj['image'] = image;

          resolve(dataObj);
        });

      for (id in catalogs) {
        if (catalogs[id] != null) {
          let currentPageData = await pagePromise(
            `https://www.bearingmodel.com/search/${catalogs[id]}`,
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

module.exports = bearingModelScraperObject;

const csvToArray = require('../services/csv_array');

const motionIndustryScraperObject = {
  async scraper(browser) {
    let scrapedData = [];
    let newPage;

    async function scrapeCurrentPage() {
      const catalogs = await csvToArray('Fenner Drives Image');
      //let catalogs = ['TTQM0616SS'];
      let pagePromise = (link, prodId) =>
        new Promise(async (resolve, reject) => {
          let dataObj = {};
          newPage = await browser.newPage();

          await newPage.setViewport({
            width: 1920 + Math.floor(Math.random() * 100),

            height: 3000 + Math.floor(Math.random() * 100),
            deviceScaleFactor: 1,
            hasTouch: false,
            isLandscape: false,
            isMobile: false,
          });

          await newPage.goto(link, {
            waitUntil: 'load',
            timeout: 50000,
          });

          // await newPage.waitForSelector('body > app-root > div');

          // await newPage.waitForSelector(
          //   'body > app-root > div > div > div > app-product-detail > div.content-container.card.mb-5.mb-md-7.mb-lg-8'
          // );

          await newPage.waitForSelector('body > app-root > div > div > div');

          let [multiProd] = await newPage.$x(
            '//*[@id="faceted-item-list"]/div/div[2]/app-item-list/app-search-item[1]/div'
          );

          if (typeof (await multiProd) !== 'undefined') {
            dataObj['product_id'] = prodId;
            dataObj['image'] = 'multiple';
            resolve(dataObj);
            return;
          }

          let [checkProd] = await newPage.$x(
            '/html/body/app-root/div/div/div/app-product-detail/div[1]/div[2]/div[2]/div[1]/h1/span[2]'
          );

          if (typeof (await checkProd) === 'undefined') {
            dataObj['product_id'] = prodId;
            dataObj['image'] = '';
            resolve(dataObj);
            return;
          }
          checkProd = await checkProd.getProperty('textContent');
          checkProd = await checkProd.jsonValue();

          if (prodId !== checkProd.trim()) {
            dataObj['product_id'] = prodId;
            dataObj['image'] = '';
            resolve(dataObj);
            return;
          }

          let [prodImage] = await newPage.$x(
            '/html/body/app-root/div/div/div/app-product-detail/div[1]/div[2]/div[1]/div/app-image/div/picture/img'
          );

          console.log('image', await prodImage);

          prodImage = await prodImage.getProperty('src');
          prodImage = await prodImage.jsonValue();
          console.log(prodImage);

          // console.log(prodImage);
          dataObj['product_id'] = prodId;
          dataObj['image'] = prodImage;

          resolve(dataObj);
          // await newPage.close();
        });

      for (id in catalogs) {
        if (catalogs[id] != null) {
          let currentPageData = await pagePromise(
            `https://www.motionindustries.com/products/search;q=${catalogs[id]}`,
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

module.exports = motionIndustryScraperObject;

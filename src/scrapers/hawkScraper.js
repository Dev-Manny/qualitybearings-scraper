const csvToArray = require('../services/csv_array');

const hawkScraperObject = {
  async scraper(browser) {
    let scrapedData = [];
    let newPage = await browser.newPage();

    async function scrapeCurrentPage() {
      const catalogs = await csvToArray('galco');

      let pagePromise = (link, prodId) =>
        new Promise(async (resolve, reject) => {
          let dataObj = {};

          await newPage.goto(link, { waitUntil: 'load', timeout: 70000 });

          await newPage.waitForSelector('.l-page');

          // check if product exists
          let [noProd] = await newPage.$x(
            '/html/body/div[1]/div[3]/div/div/div/h5'
          );

          if (typeof (await noProd) !== 'undefined') {
            dataObj['product_id'] = prodId;
            dataObj['image'] = '';
            resolve(dataObj);
            return;
          }

          // Loop through products

          let [totalProd] = await newPage.$x(
            '/html/body/div[1]/div[3]/div/div/div[2]/table/tbody'
          );

          totalProd = await totalProd.getProperty('children');
          totalProd = await (await totalProd.getProperty('length')).jsonValue();

          for (i = 1; i <= totalProd; i++) {
            let q = `/html/body/div[1]/div[3]/div/div/div[2]/table/tbody/tr[${i}]/td[1]/h5/a`;
            let [newProdName] = await newPage.$x(q);
            newProdName = await newProdName.getProperty('textContent');

            newProdName = await newProdName.jsonValue();

            if (newProdName === prodId.toLowerCase()) {
              let [prodImage] = await newPage.$x(
                `/html/body/div[1]/div[3]/div/div/div[2]/table/tbody/tr[${i}]/td[1]/div/img`
              );
              prodImage = await prodImage.getProperty('src');
              prodImage = await prodImage.jsonValue();

              prodImage = prodImage.replace(
                'listing_page_thumb',
                'product_detail_page'
              );

              prodImage = prodImage.substring(0, prodImage.indexOf('?'));

              if (
                prodImage ===
                'https://www.hawkusa.com/sites/hawk-dev.ent.c-g.io/files/styles/product_detail_page/public/manufacture_group/HPS/image/Screen%20Shot%202020-05-06%20at%2010.12.08%20AM.png'
              ) {
                prodImage = '';
              }
              console.log(prodImage);

              dataObj['product_id'] = prodId;
              dataObj['image'] = prodImage;

              resolve(dataObj);
              return;
            }
          }

          dataObj['product_id'] = prodId;
          dataObj['image'] = '';

          resolve(dataObj);
          // await newPage.close();
        });

      for (id in catalogs) {
        if (catalogs[id] != null) {
          let currentPageData = await pagePromise(
            `https://www.hawkusa.com/search-query?search_api_views_fulltext=${catalogs[id]}`,
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

module.exports = hawkScraperObject;

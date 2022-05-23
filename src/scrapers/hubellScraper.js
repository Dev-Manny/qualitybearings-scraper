const csvToArray = require('../services/csv_array');

const hubellScraperObject = {
  async scraper(browser) {
    let scrapedData = [];
    let newPage = await browser.newPage();

    async function scrapeCurrentPage() {
      const catalogs = await csvToArray('gordon');

      let pagePromise = (link, prodId) =>
        new Promise(async (resolve, reject) => {
          let dataObj = {};

          await newPage.goto(link, { waitUntil: 'load', timeout: 70000 });

          await newPage.waitForSelector('#content');

          const [error] = await newPage.$x(
            `//*[@id="content"]/div[1]/div[3]/div[2]/b`
          );

          if (typeof (await error) !== 'undefined') {
            dataObj['product_id'] = prodId;
            dataObj['image'] = '';
            resolve(dataObj);
            return;
          }

          const [hasMultipleProduct] = await newPage.$x(
            `//*[@id="content"]/div[1]/div[3]/form/div[4]`
          );

          if (typeof (await hasMultipleProduct) !== 'undefined') {
            let [totalProd] = await newPage.$x(
              `//*[@id="content"]/div[1]/div[3]/form/div[4]/ul`
            );
            totalProd = await totalProd.getProperty('children');
            totalProd = await (
              await totalProd.getProperty('length')
            ).jsonValue();

            console.log(totalProd);

            for (i = 1; i <= totalProd; i++) {
              console.log('got in');
              let q = `//*[@id="content"]/div[1]/div[3]/form/div[4]/ul/li[${i}]/div[2]`;
              let [newProdName] = await newPage.$x(q);
              newProdName = await newProdName.getProperty('textContent');

              newProdName = await newProdName.jsonValue();

              // contains
              if (newProdName.includes(prodId)) {
                let [prodLink] = await newPage.$x(
                  `//*[@id="content"]/div[1]/div[3]/form/div[4]/ul/li[${i}]/div[2]/a`
                );

                if (typeof (await prodLink) !== 'undefined') {
                  link = await prodLink.getProperty('href');

                  const prodUrl = await link.jsonValue();

                  await newPage.goto(prodUrl, {
                    waitUntil: 'load',
                    timeout: 50000,
                  });

                  await newPage.waitForSelector('#content');

                  let [prodImage] = await newPage.$x(
                    '//*[@id="big-image"]/img[2]'
                  );
                  if (typeof (await prodImage) === 'undefined') {
                    dataObj['product_id'] = prodId;
                    dataObj['image'] = '';
                    resolve(dataObj);
                    return;
                  }
                  prodImage = await prodImage.getProperty('src');
                  prodImage = await prodImage.jsonValue();

                  if (
                    prodImage ===
                    'https://ideadigitalasset.com/DAMRoot/Original/11641/11456_RVMEL9ZPOCTBFADG.jpg'
                  ) {
                    prodImage = '';
                  }

                  dataObj['product_id'] = prodId;
                  dataObj['image'] = prodImage;

                  resolve(dataObj);
                  return;
                }
              }
            }
          }

          let [prodImage] = await newPage.$x('//*[@id="big-image"]/img[2]');

          if (typeof (await prodImage) === 'undefined') {
            dataObj['product_id'] = prodId;
            dataObj['image'] = '';
            resolve(dataObj);
            return;
          }
          prodImage = await prodImage.getProperty('src');
          prodImage = await prodImage.jsonValue();

          if (
            prodImage ===
            'https://ideadigitalasset.com/DAMRoot/Original/11641/11456_RVMEL9ZPOCTBFADG.jpg'
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
            `https://www.gordonelectricsupply.com/search?text=${catalogs[id]}`,
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

module.exports = hubellScraperObject;

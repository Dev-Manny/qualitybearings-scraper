const csvToArray = require('../services/csv_array');

const fyhScraperObject = {
  async scraper(browser) {
    let scrapedData = [];
    let newPage = await browser.newPage();

    async function scrapeCurrentPage() {
      const catalogs = await csvToArray('FYH image');

      let pagePromise = (link, prodId) =>
        new Promise(async (resolve, reject) => {
          let dataObj = {};

          await newPage.goto(link, { waitUntil: 'load', timeout: 70000 });

          await newPage.waitForSelector('.l-main');

          let [hasProd] = await newPage.$x(`//*[@id="load_contents"]/p`);

          if (typeof (await hasProd) !== 'undefined') {
            dataObj['product_id'] = prodId;
            dataObj['image'] = '';
            resolve(dataObj);
            return;
          }

          console.log('testing for multiple items');
          // check if the product has multiple items
          let [hasMultipleProduct] = await newPage.$x(
            `/html/body/div[1]/div[3]/div[4]/div[1]/div/div/ul`
          );

          if (typeof (await hasMultipleProduct) !== 'undefined') {
            console.log('has multiple products');
            let [totalProd] = await newPage.$x(
              `/html/body/div[1]/div[3]/div[4]/div[1]/div/div/ul`
            );

            totalProd = await totalProd.getProperty('children');
            totalProd = await (
              await totalProd.getProperty('length')
            ).jsonValue();

            console.log(totalProd);
            for (i = 1; i <= totalProd; i++) {
              let [checkProdBrand] = await newPage.$x(
                `/html/body/div[1]/div[3]/div[4]/div[1]/div/div/ul/li[${i}]/div/div[1]/div/div[2]/p[3]`
              );

              checkProdBrand = await checkProdBrand.getProperty('textContent');

              checkProdBrand = await checkProdBrand.jsonValue();

              if (checkProdBrand == 'FYH Bearing Units') {
                console.log('got inside check prod brand');
                let [getImageLink] = await newPage.$x(
                  `/html/body/div[1]/div[3]/div[4]/div[1]/div/div/ul/li[${i}]/div/div[1]/div/div[1]/img`
                );

                getImageLink = await getImageLink.getProperty('src');
                getImageLink = await getImageLink.jsonValue();
                console.log(getImageLink);

                dataObj['product_id'] = prodId;
                dataObj['image'] = getImageLink;
                resolve(dataObj);
                return;
              }
              console.log('got out');
            }
          }

          console.log('does not have multiple');
          let [checkProd] = await newPage.$x(`//*[@id="ProductCode"]`);

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

          if (newCheckProd.includes(newProdId)) {
            let [prodLink] = await newPage.$x(
              '/html/body/div[1]/div[3]/div[4]/div[1]/div/div[1]/img'
            );
            link = await prodLink.getProperty('src');
            imageUrl = await link.jsonValue();
          }

          dataObj['product_id'] = prodId;
          dataObj['image'] = imageUrl;

          resolve(dataObj);
        });

      for (id in catalogs) {
        if (catalogs[id] != null) {
          let currentPageData = await pagePromise(
            `https://us.misumi-ec.com/vona2/result/?Keyword=${catalogs[id]}`,
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

module.exports = fyhScraperObject;

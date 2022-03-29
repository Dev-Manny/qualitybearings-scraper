const csvToArray = require('../services/csv_array');
let userAgent = require('user-agents');

const texasBeltingScraperObject = {
  async scraper(browser) {
    let scrapedData = [];

    async function scrapeCurrentPage() {
      const catalogs = await csvToArray('FAG Bearing');

      // let catalogs = [
      //   '3202.2RS',
      //   '6206-C-2HRS-L038',
      //   'NU2248MA',
      //   '6311-TB-P6-C3',
      //   '24140-BE-XL-C3',
      //   //'7210-B-XL-MP-UB',
      // ];

      let pagePromise = (link, prodId) =>
        new Promise(async (resolve, reject) => {
          let dataObj = {};
          let image = '';

          newPage = await browser.newPage();
          await newPage.goto(link, { waitUntil: 'load', timeout: 50000 });

          await newPage.waitForSelector('#main', { timeout: 500000 });

          let [checkProd] = await newPage.$x('//*[@id="PLP_PartNumber1"]');
          if (typeof (await checkProd) === 'undefined') {
            dataObj['product_id'] = prodId;
            dataObj['image'] = '';
            resolve(dataObj);
            return;
          }
          checkProd = await checkProd.getProperty('textContent');
          checkProd = (await checkProd.jsonValue()).trim();
          console.log('check proud', checkProd);
          if (checkProd === 'No products') {
            dataObj['product_id'] = prodId;
            dataObj['image'] = '';
            resolve(dataObj);
            return;
          }

          // count the number of times to loop
          let [items] = await newPage.$x(
            '//*[@id="main"]/div[3]/div[3]/div[2]/div[2]'
          );
          items = await items.getProperty('children');
          items = await (await items.getProperty('length')).jsonValue();
          console.log(items);
          for (let i = 1; i <= items; i++) {
            let x = `//*[@id="PLP_Brand_Label${i}"]`;
            console.log(x);
            let [brand] = await newPage.$x(x);
            brand = await brand.getProperty('textContent');
            brand = (await brand.jsonValue()).trim();

            console.log(brand);
            if (brand.toUpperCase() === 'FAG BEARING') {
              let y = `//*[@id="PLP_Product_Name${i}"]`;
              let [prodName] = await newPage.$x(y);
              prodName = await prodName.getProperty('textContent');
              prodName = (await prodName.jsonValue()).trim();
              console.log('got in here');
              // remove all special characters
              prodName = prodName.replace(/[^\w\s]/gi, '');
              prodId = prodId.replace(/[^\w\s]/gi, '');

              console.log(prodName);
              console.log(prodId);
              if (!prodName.includes(prodId)) {
                dataObj['product_id'] = prodId;
                dataObj['image'] = '';
                resolve(dataObj);
                return;
              }

              let z = `//*[@id="PLP_Product_Name${i}"]/a`;
              // move to a new page
              let [newLink] = await newPage.$x(z);
              newLink = await newLink.getProperty('href');
              newLink = await newLink.jsonValue();

              console.log(newLink);

              await newPage.goto(newLink);

              console.log('new page comings');
              let [prodImage] = await newPage.$x(
                '//*[@id="primary-image-link"]/img'
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

              if (
                image ===
                'https://www.bdiexpress.com/_ui/desktop/green/images/missing-product-300x300-en.jpg'
              ) {
                dataObj['product_id'] = prodId;
                dataObj['image'] = '';
                resolve(dataObj);
                return;
              }

              dataObj['product_id'] = prodId;
              dataObj['image'] = image;
              resolve(dataObj);
              await newPage.close();
              return;
            }
          }

          dataObj['product_id'] = prodId;
          dataObj['image'] = image;

          console.log('to the end');
          resolve(dataObj);
          await newPage.close();
          return;
        });

      for (id in catalogs) {
        console.log(id);
        if (catalogs[id] != null) {
          let currentPageData = await pagePromise(
            `https://www.bdiexpress.com/us/en/search?searchBy=ALL&q=${catalogs[id]}&fromcf=true`,
            catalogs[id]
          );
          console.log(id, ' got', catalogs[id]);
          scrapedData.push(currentPageData);
          await newPage.close();
        }
      }
      return scrapedData;
    }

    let data = await scrapeCurrentPage();

    return data;
  },
};

module.exports = texasBeltingScraperObject;

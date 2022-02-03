const texasBeltingScraperObject = {
  async scraper(browser) {
    let scrapedData = [];
    let newPage = await browser.newPage();

    async function scrapeCurrentPage() {
      let catalogs = [
        '712900745',
        '95790035',
        '1610-14M-40',
        '27230',
        // '79630016',
        // '79630010',
      ];

      let pagePromise = (link, prodId) =>
        new Promise(async (resolve, reject) => {
          let dataObj = {};
          let image = '';

          await newPage.goto(link, { waitUntil: 'load', timeout: 50000 });

          await newPage.waitForSelector('#main');

          let [checkProd] = await newPage.$x(
            '//*[@id="shopify-section-search-template"]/section/div[1]/div[3]/div[2]/div/div/header/div/div/div/div/p'
          );
          checkProd = await checkProd.getProperty('textContent');
          checkProd = await checkProd.jsonValue();
          if (checkProd === 'No products') {
            dataObj['product_id'] = prodId;
            dataObj['image'] = '';
            resolve(dataObj);
            return;
          }

          let [prodLink] = await newPage.$x(
            '//*[@id="shopify-section-search-template"]/section/div[1]/div[3]/div[2]/div/div/div/div[2]/div/div[2]/div/a'
          );

          prodLink = await prodLink.getProperty('href');
          prodLink = await prodLink.jsonValue();

          await newPage.goto(prodLink, {
            waitUntil: 'load',
            timeout: 50000,
          });

          let [prodName] = await newPage.$x(
            '//*[@id="shopify-section-product-template"]/section/div[1]/div[2]/div/div[2]/div/div[2]/div[1]/h1'
          );

          prodName = await prodName.getProperty('textContent');
          prodName = await prodName.jsonValue();
          if (!prodName.includes(prodId)) {
            dataObj['product_id'] = prodId;
            dataObj['image'] = '';
            resolve(dataObj);
            return;
          }

          let [prodImage] = await newPage.$x(
            '//*[@id="shopify-section-product-template"]/section/div[1]/div[2]/div/div[1]/div/div/div/div[2]/div/div/a'
          );
          prodImage = await prodImage.getProperty('href');
          prodImage = await prodImage.jsonValue();

          dataObj['product_id'] = prodId;
          dataObj['image'] = prodImage.slice(0, prodImage.lastIndexOf('?'));

          resolve(dataObj);
          // await newPage.close();
        });

      for (id in catalogs) {
        if (catalogs[id] != null) {
          let currentPageData = await pagePromise(
            `https://texasbelting.com/search?type=product&q=${catalogs[id]}*`,
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

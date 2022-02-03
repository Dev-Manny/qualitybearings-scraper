const royalScraperObject = {
  async scraper(browser) {
    let scrapedData = [];
    let newPage = await browser.newPage();

    async function scrapeCurrentPage() {
      let catalogs = [
       "92742160",
      ];

      let pagePromise = (link, prodId) =>
        new Promise(async (resolve, reject) => {
          let dataObj = {};
          let image = '';

          await newPage.goto(link, { waitUntil: 'load', timeout: 50000 });

          if(prodId.length === 8) {
             prodId = prodId.substr(0, 4) + "-" + prodId.substr(4, 6)
          }

          await newPage.waitForSelector('input[id=pcHSearch]');

          await newPage.$eval(
            'input[id=pcHSearch]',
            (el, b) => {
              el.value = b;
            },
            prodId
          );

          await newPage.click('input[id="pcHSearchSubmit"]');

          await newPage.waitForSelector('#pcMain');
          // console.log('inside');
          let [noProduct] = await newPage.$x('//*[@id="m"]/div[1]');
          // console.log(await noProduct);
          if (typeof (await noProduct) === 'undefined') {
            dataObj['product_id'] = prodId;
            dataObj['image'] = '';
            resolve(dataObj);
            return;
          }

          let [totalProd] = await newPage.$x('//*[@id="m"]/div[1]/div[2]');
          totalProd = await totalProd.getProperty('children');
          totalProd = await (await totalProd.getProperty('length')).jsonValue();

          for (i = 2; i <= totalProd - 1; i++) {
            let [prodLink] = await newPage.$x(
              `//*[@id="m"]/div[1]/div[2]/div[${i}]/div[4]/div[1]/a`
            );

            if (typeof (await prodLink) !== 'undefined') {
              link = await prodLink.getProperty('href');

              const prodUrl = await link.jsonValue();

              await newPage.goto(prodUrl, {
                waitUntil: 'load',
                timeout: 50000,
              });

              await newPage.waitForSelector('#pcMainArea');

              let prodLen = (await newPage.$$('.pcShowProductCustSearchDetail'))
                .length;

              for (i = 0; i <= prodLen - 1; i++) {
                let [productV] = await newPage.$x(
                  `//*[@id="pcViewProductL"]/div[2]/div[${i + 10}]`
                );
                productV = await productV.getProperty('textContent');
                productV = (await productV.jsonValue()).trim();
                let productID = productV.substring(productV.indexOf(':') + 1);
                let prodTitle = productV.substring(
                  0,
                  productV.lastIndexOf(':')
                );

                if (prodTitle === 'Product Number') {
                  let newProdId = prodId.replace(/[^a-zA-Z ]/g, '');
                  productID = productID.replace(/[^a-zA-Z ]/g, '');
                  if (productID !== newProdId) {
                    console.log('transfer');
                    dataObj['product_id'] = prodId;
                    dataObj['image'] = '';
                    resolve(dataObj);
                    return;
                  }
                  let [prodImage] = await newPage.$x('//*[@id="mainimgdiv"]/a');
                  prodImage = await prodImage.getProperty('href');
                  prodImage = (await prodImage.jsonValue()).trim();
                  console.log(prodImage);
                  dataObj['product_id'] = prodId;
                  dataObj['image'] = prodImage;
                }
              }
            }
          }

          // console.log('got here');
          resolve(dataObj);
          // await newPage.close();
        });

      for (id in catalogs) {
        if (catalogs[id] != null) {
          let currentPageData = await pagePromise(
            `https://www.royalsupply.com/store/pc/viewcategories.asp`,
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

module.exports = royalScraperObject;

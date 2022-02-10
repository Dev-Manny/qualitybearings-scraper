const santaClaraScraperObject = {
  async scraper(browser) {
    //stores all scrapped data
    let scrapedData = [];

    // opens a new browser
    let newPage = await browser.newPage();

    async function scrapeCurrentPage() {
      let catalogs = ['100-3101', '100-3103', '100-3104'];

      let pagePromise = (link, prodId) =>
        new Promise(async (resolve, reject) => {
          let dataObj = {};
          let description = '';

          // waits for the link to be opened
          await newPage.goto(link, { waitUntil: 'load', timeout: 50000 });

          await newPage.waitForSelector('#products-view');

          let q =
            '#catalog-hits > div > div.col-xs-8.col-md-4.col-lg-3 > div > a';

          await newPage.click(q);

          console.log('here', await hey);

          resolve(dataObj);
          // await newPage.close();
        });

      for (id in catalogs) {
        if (catalogs[id] != null) {
          let currentPageData = await pagePromise(
            `https://www.santaclarasystems.com/en-gb/search?#q=${catalogs[id]}*`,
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

module.exports = santaClaraScraperObject;

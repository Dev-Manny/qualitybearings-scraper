const skfScraperObject = {
  url: "https://www.qualitybearingsonline.com/deep-groove/6200-series/?sort=bestselling&page=6",
  async scraper(browser) {
    let page = await browser.newPage();
    console.log(`Navigating to ${this.url}...`);
    await page.goto(this.url, { waitUntil: "load", timeout: 70000 });
    let scrapedData = [];

    // Wait for the required DOM to be rendered
    async function scrapeCurrentPage() {
      await page.waitForSelector(".listing-wrapper");
      // Get the link to all the required books
      let urls = await page.$$eval("article", (links) => {
        //Extract the links from the data
        links = links.map((el) =>
          el ? el.querySelector("h3 > a").href : null
        );
        return links;
      });

      //Loop through each of those links, open a new page instance and get the relevant data from them
      let pagePromise = (link) =>
        new Promise(async (resolve, reject) => {
          let dataObj = {};
          let newPage = await browser.newPage();
          await newPage.goto(link, { waitUntil: "load", timeout: 70000 });

          const [brand] = await newPage.$x(
            '//*[@id="product-description"]/div[2]/dd[1]/img'
          );
          const [pid] = await newPage.$x(
            '//*[@id="product-description"]/div[2]/dd[2]'
          );
          const [insideDiameter] = await newPage.$x(
            '//*[@id="product-description"]/dd[1]'
          );
          const [outsideDiameter] = await newPage.$x(
            '//*[@id="product-description"]/dd[2]'
          );
          const [width] = await newPage.$x(
            '//*[@id="product-description"]/dd[3]'
          );
          const [cageType] = await newPage.$x(
            '//*[@id="product-description"]/dd[4]'
          );
          const [clearance] = await newPage.$x(
            '//*[@id="product-description"]/dd[6]'
          );

          const brandSrc = await brand.getProperty("src");
          const pidTxt = await pid.getProperty("textContent");
          const insideDiameterTxt = await insideDiameter.getProperty(
            "textContent"
          );
          const outsideDiameterTxt = await outsideDiameter.getProperty(
            "textContent"
          );
          const widthTxt = await width.getProperty("textContent");
          const cageTypeTxt = await cageType.getProperty("textContent");
          const clearanceTxt = await clearance.getProperty("textContent");

          dataObj["brand"] = await brandSrc.jsonValue();
          dataObj["productID"] = await pidTxt.jsonValue();
          dataObj["insideDiameter"] = await insideDiameterTxt.jsonValue();
          dataObj["outsideDiameter"] = await outsideDiameterTxt.jsonValue();
          dataObj["width"] = await widthTxt.jsonValue();
          dataObj["cageType"] = (await cageTypeTxt.jsonValue()) + " cage";
          dataObj["clearance"] = await clearanceTxt.jsonValue();

          resolve(dataObj);
          await newPage.close();
        });

      for (link in urls) {
        // console.log(urls[link]);
        if (urls[link] != null) {
          //  console.log("got in");
          let currentPageData = await pagePromise(urls[link]);
          scrapedData.push(currentPageData);
        }
      }
      // When all the data on this page is done, click the next button and start the scrapping
      // Check if button exists

      let nextButtonExist = false;
      let newPageLink;
      try {
        console.log('inside doing');
        const [nextButton] = await page.$x(
          "/html/body/div[2]/main/section/div[1]/div[4]/nav/a[8]"
        );
       
        const newPage = await nextButton.getProperty("href");
        newPageLink = await newPage.jsonValue();
        console.log(`Next page link is: ${await newPageLink}`);
        nextButtonExist = true;
        if (await newPageLink === 'https://www.qualitybearingsonline.com/deep-groove/6200-series/?sort=bestselling&page=50'){
          console.log('End of life');
          nextButtonExist = false;
        }
  
      } catch (e) {
        nextButtonExist = false;
      }

      if (nextButtonExist) {
        console.log("moving to next page");
        console.log(newPageLink);
        await page.goto(newPageLink);
        return scrapeCurrentPage();
      }
      await page.close();
      return scrapedData;
    }

    let data = await scrapeCurrentPage();
    console.log(data);
    return data;
  },
};

module.exports = skfScraperObject;

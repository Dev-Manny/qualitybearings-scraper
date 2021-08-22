const scraperObject = {
  url: "http://books.toscrape.com/catalogue/page-2.html",
  async scraper(browser) {
    let page = await browser.newPage();
    console.log(`Navigating to ${this.url}...`);
    await page.goto(this.url, { waitUntil: "load", timeout: 70000 });
    let scrapedData = [];

    // Wait for the required DOM to be rendered
    async function scrapeCurrentPage() {
      await page.waitForSelector(".page_inner");
      // Get the link to all the required books
      let urls = await page.$$eval("section ol > li", (links) => {
        links = links.filter((link) =>
          link
            ? link.querySelector(".instock.availability > i").textContent !==
              "In stock "
            : null
        );

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
          console.log(link);
          await newPage.goto(link, { waitUntil: "load", timeout: 70000 });
          dataObj["bookTitle"] = await newPage.$eval(
            ".product_main > h1",
            (text) => (text ? text.textContent : null)
          );
          dataObj["bookPrice"] = await newPage.$eval(".price_color", (text) =>
            text ? text.textContent : null
          );
          dataObj["noAvailable"] = await newPage.$eval(
            ".instock.availability",
            (text) => {
              if (text) {
                // Strip new line and tab spaces
                text = text.textContent.replace(/(\r\n\t|\n|\r|\t)/gm, "");
                // Get the number of stock available
                let regexp = /^.*\((.*)\).*$/i;
                let stockAvailable = regexp.exec(text)[1].split(" ")[0];
                return stockAvailable;
              }
              return null;
            }
          );
          dataObj["imageUrl"] = await newPage.$eval(
            "#product_gallery img",
            (img) => (img ? img.src : null)
          );
          dataObj["bookDescription"] = await newPage.$eval(
            "#product_description",
            (div) => (div ? div.nextSibling.nextSibling.textContent : null)
          );
          resolve(dataObj);
          await newPage.close();
        });

      for (link in urls) {
        console.log(urls[link]);
        if (urls[link] != null) {
          console.log("got in");
          let currentPageData = await pagePromise(urls[link]);
          scrapedData.push(currentPageData);
        }
      }

      // When all the data on this page is done, click the next button and start the scrapping
      // Check if button exists
      //   let nextButtonExist = false;
      //   try {
      //     const nextButton = await page.$eval(".next > a", (a) => a.textContent);
      //     nextButtonExist = true;
      //   } catch (e) {
      //     nextButtonExist = false;
      //   }

      //   if (nextButtonExist) {
      //     await page.click(".next > a");
      //     return scrapeCurrentPage();
      //   }

      await page.close();
      return scrapedData;
    }

    let data = await scrapeCurrentPage();
    console.log(data);
    return data;
  },
};

module.exports = scraperObject;

const baldorScraperObject = {
  async scraper(browser) {
    let scrapedData = [];
    let newPage;

    // Wait for the required DOM to be rendered
    async function scrapeCurrentPage() {
      //Loop through each of those links, open a new page instance and get the relevant data from them
      let urls = [
        "471785",
        "471786",
        "471787",
        "471788",
        "471793",
        "471792",
        "471791",
        "471789",
        "471790",
        "471784",
        "471782",
      ];

      let pagePromise = (link, prodId) =>
        new Promise(async (resolve, reject) => {
          console.log("start to scrape");
          let dataObj = {};
          let itemTitle;
          let b;
          let res;
          let val;
          newPage = await browser.newPage();
          // console.log(newPage);
          await newPage.goto(link, { waitUntil: "load", timeout: 100000 });

          // bushing type value
          const [bushing] = await newPage.$x(
            '//*[@id="Content_C004_Col00"]/div/div[3]/div[2]/div/div/div[1]/div/div/div[2]/div[1]/ul/li[2]/dl/dd'
          );

          const [material] = await newPage.$x(
            '//*[@id="Content_C004_Col00"]/div/div[3]/div[2]/div/div/div[1]/div/div/div[2]/div[1]/ul/li[3]/dl/dd'
          );

          const [diameter] = await newPage.$x(
            '//*[@id="Content_C004_Col00"]/div/div[3]/div[2]/div/div/div[1]/div/div/div[2]/div[3]/ul/li[1]/dl/dd'
          );

          const [length] = await newPage.$x(
            '//*[@id="Content_C004_Col00"]/div/div[3]/div[2]/div/div/div[1]/div/div/div[2]/div[3]/ul/li[2]/dl/dd'
          );
          let bushingType = await bushing.getProperty("textContent");
          let materialType = await material.getProperty("textContent");
          let theDiameter = await diameter.getProperty("textContent");
          let theLength = await length.getProperty("textContent"); 


          dataObj['Busing Type'] = await bushingType.jsonValue();
          dataObj["Material Type"] = await materialType.jsonValue();
          dataObj["Diameter"]= await theDiameter.jsonValue();
          dataObj["Length"] = await theLength.jsonValue();
          dataObj["Product ID"] = prodId;
          console.log(dataObj);
          resolve(dataObj);
          await newPage.close();
      
        });
    
    
      for (link in urls) {
        
        console.log(urls[link]);
        if (urls[link] != null) {
          console.log("got in");
          console.log(`https://new.abb.com/products/7B${urls[link]}/${urls[link]}`);
          let currentPageData = await pagePromise(
            `https://new.abb.com/products/7B${urls[link]}/${urls[link]}`,
            urls[link]
          );

          scrapedData.push(currentPageData);
        }
      }

      await newPage.close();
      return scrapedData;
    }
    let data = await scrapeCurrentPage();
    console.log(data);
    return data;
  },
};

module.exports = baldorScraperObject;

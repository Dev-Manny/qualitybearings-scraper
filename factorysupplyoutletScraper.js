const factorysupplyoutletScraperObject = {
  async scraper(browser) {
    let scrapedData = [];
    let newPage;

    // Wait for the required DOM to be rendered
    async function scrapeCurrentPage() {
      //Loop through each of those links, open a new page instance and get the relevant data from them
      let urls = [
        "119254",
        "117169",
        "119262",
      ];

      let pagePromise = (link, prodId) =>
        new Promise(async (resolve, reject) => {
          let dataObj = {};
          newPage = await browser.newPage();
          await newPage.goto(link, { waitUntil: "load", timeout: 70000 });
          console.log("inside here");
          const [lh] = await newPage.$x(
            '//*[@id="topOfPage"]/div[6]/div[1]/div/main/div[1]/div[1]/div[5]/article/div[1]/div[1]/ul/a/li[3]/div[1]'
          );
          // Check if the right hand side list is Outside Diameter
          const [rh] = await newPage.$x(
            '//*[@id="topOfPage"]/div[6]/div[1]/div/main/div[1]/div[1]/div[5]/article/div[1]/div[1]/ul/a/li[2]/div[1]'
          );

          if (typeof (await lh) !== "undefined") {
            const lhType = await lh.getProperty("textContent");

            if ((await lhType.jsonValue()) === "Outside Diameter:") {
              const [lhVal] = await newPage.$x(
                '//*[@id="topOfPage"]/div[6]/div[1]/div/main/div[1]/div[1]/div[5]/article/div[1]/div[1]/ul/a/li[3]/div[2]'
              );
              if (typeof (await lhVal) !== "undefined") {
                const lhValType = await lhVal.getProperty("textContent");
                let odVal = await lhValType.jsonValue();
                odVal = odVal.split("/")[0].replace(" Inch", '"');
                dataObj["productID"] = prodId;
                dataObj["OutsideDiameter"] = odVal;
                resolve(dataObj);
                await newPage.close();
              } else {
                dataObj["productID"] = prodId;
                resolve(dataObj);
                await newPage.close();
              }
            } else {
              if (typeof (await rh) !== "undefined") {
                const rhType = await rh.getProperty("textContent");
                // check the right hand side
                if ((await rhType.jsonValue()) === "Outside Diameter:") {
                  const [rhVal] = await newPage.$x(
                    '//*[@id="topOfPage"]/div[6]/div[1]/div/main/div[1]/div[1]/div[5]/article/div[1]/div[1]/ul/a/li[2]/div[2]'
                  );
                  if (typeof (await rhVal) !== "undefined") {
                    const rhValType = await rhVal.getProperty("textContent");
                    let rodVal = await rhValType.jsonValue();
                    rodVal = rodVal.split("/")[0].replace(" Inch", '"');
                    dataObj["productID"] = prodId;
                    dataObj["OutsideDiameter"] = rodVal;
                    resolve(dataObj);
                    await newPage.close();
                  } else {
                    dataObj["productID"] = prodId;
                    resolve(dataObj);
                    await newPage.close();
                  }
                } else {
                  dataObj["productID"] = prodId;
                  resolve(dataObj);
                  await newPage.close();
                }
              } else {
                dataObj["productID"] = prodId;
                resolve(dataObj);
                await newPage.close();
              }
            }
          } else {
            console.log("undefined");
            dataObj["productID"] = prodId;
            resolve(dataObj);
            await newPage.close();
          }
        });

      console.log("looping");
      console.log(urls);

      for (link in urls) {
        console.log(urls[link]);
        if (urls[link] != null) {
          console.log("got in");
          console.log(`https://factorysupplyoutlet.com/dodge-${urls[link]}`);
          let currentPageData = await pagePromise(
            `https://factorysupplyoutlet.com/dodge-${urls[link]}`,
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

module.exports = factorysupplyoutletScraperObject;

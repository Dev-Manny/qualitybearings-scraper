const baldorScraperObject = {
  async scraper(browser) {
    let scrapedData = [];
    let newPage;

    // Wait for the required DOM to be rendered
    async function scrapeCurrentPage() {
      //Loop through each of those links, open a new page instance and get the relevant data from them
      let urls = ["119149", "119148", "119147"];

      let pagePromise = (link) =>
        new Promise(async (resolve, reject) => {
          let dataObj = {};
          newPage = await browser.newPage();
          // console.log(newPage);
          await newPage.goto(link, { waitUntil: "load", timeout: 250000 });
          console.log("inside here");

          const [spec] = await newPage.$x(
            '//*[@id="catalog-detail"]/div[2]/div/div/div/nav/ul/li[1]'
          );

          const [type] = await newPage.$x(
            '//*[@id="catalog-detail"]/div[2]/div/div/div/div/div[1]/div[2]/div[2]/div[1]/span[1]'
          );

          if (typeof (await spec) !== "undefined") {
            const chkSpec = await spec.getProperty("textContent");

            if ((await chkSpec.jsonValue()) === "Specs") {
              if (typeof (await type) !== "undefined") {
                const chkType = await type.getProperty("textContent");
                console.log("check type");
                console.log(await chkType.jsonValue());
                if ((await chkType.jsonValue()) === "Bushing Length") {
                  console.log("fantasy");
                  //Product ID
                  const [pid] = await newPage.$x(
                    '//*[@id="content"]/div[3]/section[1]/div[3]/h1'
                  );
                  //Outside Diameter
                  const [od] = await newPage.$x(
                    '//*[@id="catalog-detail"]/div[2]/div/div/div/div/div[1]/div[2]/div[2]/div[1]/span[2]'
                  );
                  if (typeof (await pid) !== "undefined") {
                    const chkPid = await pid.getProperty("textContent");
                    const chkOd = await od.getProperty("textContent");
                    let res = await chkOd.jsonValue();
                    let outsideDiameter = res.replace(/\D/g, "").concat(' "');

                    dataObj["product ID"] = await chkPid.jsonValue();
                    dataObj["Outside Diameter"] = outsideDiameter;
                    resolve(dataObj);
                    await newPage.close();
                  } else {
                    console.log("pid is undefined");
                    resolve(dataObj);
                    await newPage.close();
                  }
                } else {
                  resolve(dataObj);
                  await newPage.close();
                }
              }
            } else {
              resolve(dataObj);
              await newPage.close();
            }
          } else {
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
          console.log(`https://www.baldor.com/catalog/${urls[link]}`);
          let currentPageData = await pagePromise(
            `https://www.baldor.com/catalog/${urls[link]}`
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

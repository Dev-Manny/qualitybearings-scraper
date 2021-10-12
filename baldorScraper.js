const baldorScraperObject = {
  async scraper(browser) {
    let scrapedData = [];
    let newPage;

    // Wait for the required DOM to be rendered
    async function scrapeCurrentPage() {
      //Loop through each of those links, open a new page instance and get the relevant data from them
      let urls = [
        "226959",
        "226850",
        "226898",
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

          // Spec tab
          const [spec] = await newPage.$x(
            '//*[@id="catalog-detail"]/div[2]/div/div/div/nav/ul/li[1]'
          );

          const [tabs] = await newPage.$x(
            '//*[@id="catalog-detail"]/div[2]/div/div/div/div/div[1]/div[2]'
          );
          console.log(typeof (await tabs));
          if(typeof (await tabs) !== 'undefined'){
            const children = await tabs.getProperty("children");
            const tabLength = await (
              await children.getProperty("length")
            ).jsonValue();
            // console.log("what is legnth: " + tabLength);

            if (typeof (await spec) !== "undefined") {
              const chkSpec = await spec.getProperty("textContent");

              if ((await chkSpec.jsonValue()) === "Specs") {
                console.log("fantasy");
                //Product ID
                const [pid] = await newPage.$x(
                  '//*[@id="content"]/div[3]/section[1]/div[3]/h1'
                );
                //Outside Diameter
                const [od] = await newPage.$x(
                  '//*[@id="catalog-detail"]/div[2]/div/div/div/div/div[1]/div[2]/div[2]/div[1]/span[2]'
                );

                for (i = 1; i <= tabLength; i++) {
                  // console.log("i is " + i);
                  if (i === 1) {
                    const [innerTab] = await newPage.$x(
                      `//*[@id="catalog-detail"]/div[2]/div/div/div/div/div[1]/div[2]/div[1]`
                    );
                    const innerChildren = await innerTab.getProperty("children");
                    const innerLength = await (
                      await innerChildren.getProperty("length")
                    ).jsonValue();
                    // console.log("what is second legth: " + innerLength);
                    for (j = 1; j <= innerLength; j++) {
                      // const valueChildren = await value.getProperty("children");
                      // const valueLength = await (
                      //   await valueChildren.getProperty("length")
                      // ).jsonValue();
                      // console.log(valueLength);
                      if (j == 1) {
                        [itemValue] = await newPage.$x(
                          `//*[@id="catalog-detail"]/div[2]/div/div/div/div/div[1]/div[2]/div[1]/div[1]/span[1]`
                        );
                        b = await itemValue.getProperty("textContent");
                        res = await b.jsonValue();
                        if (
                          res === "Bore Size" ||
                          res === "Bushing Size" ||
                          res === "Casting Material" ||
                          res === "Keyway Size"
                        ) {
                          [value] = await newPage.$x(
                            '//*[@id="catalog-detail"]/div[2]/div/div/div/div/div[1]/div[2]/div[1]/div[1]/span[2]'
                          );
                          b = await value.getProperty("textContent");
                          value = await b.jsonValue();
                          dataObj[`${res}`] = value.replace(/\n/g, "").trim();
                        }
                      }
                      if (j == 2) {
                        [itemTitile] = await newPage.$x(
                          `//*[@id="catalog-detail"]/div[2]/div/div/div/div/div[1]/div[2]/div[1]/div[2]/span[1]`
                        );
                        b = await itemTitile.getProperty("textContent");
                        res = await b.jsonValue();
                        if (
                          res === "Bore Size" ||
                          res === "Bushing Size" ||
                          res === "Casting Material" ||
                          res === "Keyway Size"
                        ) {
                          // console.log("title is: " + res);
                          [value] = await newPage.$x(
                            '//*[@id="catalog-detail"]/div[2]/div/div/div/div/div[1]/div[2]/div[1]/div[2]/span[2]'
                          );
                          b = await value.getProperty("textContent");
                          value = await b.jsonValue();
                          dataObj[`${res}`] = value.replace(/\n/g, "").trim();
                        }
                      }
                      if (j == 3) {
                        [itemTitile] = await newPage.$x(
                          `//*[@id="catalog-detail"]/div[2]/div/div/div/div/div[1]/div[2]/div[1]/div[3]/span[1]`
                        );
                        b = await itemTitile.getProperty("textContent");
                        res = await b.jsonValue();
                        if (
                          res === "Bore Size" ||
                          res === "Bushing Size" ||
                          res === "Casting Material" ||
                          res === "Keyway Size"
                        ) {
                          console.log("title is: " + res);
                          [value] = await newPage.$x(
                            '//*[@id="catalog-detail"]/div[2]/div/div/div/div/div[1]/div[2]/div[1]/div[3]/span[2]'
                          );
                          b = await value.getProperty("textContent");
                          value = await b.jsonValue();
                          dataObj[`${res}`] = value.replace(/\n/g, "").trim();
                        }
                      }
                      if (j == 4) {
                        [itemTitile] = await newPage.$x(
                          `//*[@id="catalog-detail"]/div[2]/div/div/div/div/div[1]/div[2]/div[1]/div[4]/span[1]`
                        );
                        b = await itemTitile.getProperty("textContent");
                        res = await b.jsonValue();
                        if (
                          res === "Bore Size" ||
                          res === "Bushing Size" ||
                          res === "Casting Material" ||
                          res === "Keyway Size"
                        ) {
                          // console.log("title is: " + res);
                          [value] = await newPage.$x(
                            '//*[@id="catalog-detail"]/div[2]/div/div/div/div/div[1]/div[2]/div[1]/div[4]/span[2]'
                          );
                          b = await value.getProperty("textContent");
                          value = await b.jsonValue();
                          dataObj[`${res}`] = value.replace(/\n/g, "").trim();
                        }
                      }
                    }
                  }

                  if (i === 2) {
                    const [innerTab] = await newPage.$x(
                      `//*[@id="catalog-detail"]/div[2]/div/div/div/div/div[1]/div[2]/div[2]`
                    );
                    const innerChildren = await innerTab.getProperty("children");
                    const innerLength = await (
                      await innerChildren.getProperty("length")
                    ).jsonValue();
                    // console.log("what is second legth: " + innerLength);
                    for (j = 1; j <= innerLength; j++) {
                      // const valueChildren = await value.getProperty("children");
                      // const valueLength = await (
                      //   await valueChildren.getProperty("length")
                      // ).jsonValue();
                      // console.log(valueLength);
                      if (j == 1) {
                        [itemValue] = await newPage.$x(
                          `//*[@id="catalog-detail"]/div[2]/div/div/div/div/div[1]/div[2]/div[2]/div[1]/span[1]`
                        );
                        b = await itemValue.getProperty("textContent");
                        res = await b.jsonValue();
                        if (
                          res === "Bore Size" ||
                          res === "Bushing Size" ||
                          res === "Casting Material" ||
                          res === "Keyway Size"
                        ) {
                          // console.log("title is: " + res);
                          [value] = await newPage.$x(
                            '//*[@id="catalog-detail"]/div[2]/div/div/div/div/div[1]/div[2]/div[2]/div[1]/span[2]'
                          );
                          b = await value.getProperty("textContent");
                          value = await b.jsonValue();
                          dataObj[`${res}`] = value.replace(/\n/g, "").trim();
                        }
                      }
                      if (j == 2) {
                        [itemTitile] = await newPage.$x(
                          `//*[@id="catalog-detail"]/div[2]/div/div/div/div/div[1]/div[2]/div[2]/div[2]/span[1]`
                        );
                        b = await itemTitile.getProperty("textContent");
                        res = await b.jsonValue();
                        if (
                          res === "Bore Size" ||
                          res === "Bushing Size" ||
                          res === "Casting Material" ||
                          res === "Keyway Size"
                        ) {
                          console.log("title is: " + res);
                          [value] = await newPage.$x(
                            '//*[@id="catalog-detail"]/div[2]/div/div/div/div/div[1]/div[2]/div[2]/div[2]/span[2]'
                          );
                          b = await value.getProperty("textContent");
                          value = await b.jsonValue();
                          dataObj[`${res}`] = value.replace(/\n/g, "").trim();
                        }
                      }
                      if (j == 3) {
                        [itemTitile] = await newPage.$x(
                          `//*[@id="catalog-detail"]/div[2]/div/div/div/div/div[1]/div[2]/div[2]/div[3]/span[1]`
                        );
                        b = await itemTitile.getProperty("textContent");
                        res = await b.jsonValue();
                        if (
                          res === "Bore Size" ||
                          res === "Bushing Size" ||
                          res === "Casting Material" ||
                          res === "Keyway Size"
                        ) {
                          // console.log("title is: " + res);
                          [value] = await newPage.$x(
                            '//*[@id="catalog-detail"]/div[2]/div/div/div/div/div[1]/div[2]/div[2]/div[3]/span[2]'
                          );
                          b = await value.getProperty("textContent");
                          value = await b.jsonValue();
                          dataObj[`${res}`] = value.replace(/\n/g, "").trim();
                        }
                      }
                      if (j == 4) {
                        [itemTitile] = await newPage.$x(
                          `//*[@id="catalog-detail"]/div[2]/div/div/div/div/div[1]/div[2]/div[2]/div[4]/span[1]`
                        );
                        b = await itemTitile.getProperty("textContent");
                        res = await b.jsonValue();
                        if (
                          res === "Bore Size" ||
                          res === "Bushing Size" ||
                          res === "Casting Material" ||
                          res === "Keyway Size"
                        ) {
                          // console.log("title is: " + res);
                          [value] = await newPage.$x(
                            '//*[@id="catalog-detail"]/div[2]/div/div/div/div/div[1]/div[2]/div[2]/div[4]/span[2]'
                          );
                          b = await value.getProperty("textContent");
                          value = await b.jsonValue();
                          dataObj[`${res}`] = value.replace(/\n/g, "").trim();
                        }
                      }
                    }
                  }
                }
                console.log(dataObj);
                if (typeof (await pid) !== "undefined") {
                  const chkPid = await pid.getProperty("textContent");

                  dataObj["Product ID"] = await chkPid.jsonValue();

                  resolve(dataObj);
                  await newPage.close();
                } else {
                  console.log("pid is undefined");
                  dataObj["Product ID"] = prodId;
                  resolve(dataObj);
                  await newPage.close();
                }
              }else{
                console.log("getting into here");
                dataObj["Product ID"] = prodId;
                // console.log(dataObj);
                resolve(dataObj);
                await newPage.close();
              }
            } else {
              console.log("getting into here");
              dataObj["Product ID"] = prodId;
              // console.log(dataObj);
              resolve(dataObj);
              await newPage.close();
            }
          } else {
            console.log("getting into here");
            dataObj["Product ID"] = prodId;
            // console.log(dataObj);
            resolve(dataObj);
            await newPage.close();
          }
        });

      for (link in urls) {
        console.log(urls[link]);
        if (urls[link] != null) {
          console.log("got in");
          console.log(`https://www.baldor.com/catalog/${urls[link]}`);
          let currentPageData = await pagePromise(
            `https://www.baldor.com/catalog/${urls[link]}`,
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

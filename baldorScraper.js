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
        "226955",
        "226906",
        "226904",
        "226903",
        "226872",
        "226865",
        "226857",
        "226847",
        "226846",
        "226845",
        "226844",
        "226843",
        "226842",
        "226841",
        "226840",
        "226839",
        "226838",
        "226837",
        "226836",
        "226835",
        "226834",
        "226833",
        "226832",
        "226831",
        "226830",
        "226653",
        "226651",
        "226645",
        "226960",
        "226958",
        "226957",
        "226956",
        "226954",
        "226953",
        "226952",
        "226951",
        "226950",
        "226949",
        "226948",
        "226947",
        "226946",
        "226945",
        "226944",
        "226940",
        "226939",
        "226938",
        "226937",
        "226936",
        "226914",
        "226913",
        "226912",
        "226911",
        "226910",
        "226909",
        "226908",
        "226907",
        "226902",
        "226901",
        "226900",
        "226899",
        "226898",
        "226897",
        "226896",
        "226895",
        "226894",
        "226893",
        "226892",
        "226891",
        "226890",
        "226889",
        "226888",
        "226887",
        "226886",
        "226885",
        "226884",
        "226883",
        "226882",
        "226881",
        "226880",
        "226879",
        "226878",
        "226877",
        "226876",
        "226875",
        "226874",
        "226873",
        "226870",
        "226869",
        "226868",
        "226867",
        "226866",
        "226864",
        "226863",
        "226862",
        "226861",
        "226860",
        "226859",
        "226858",
        "226856",
        "226855",
        "226854",
        "226853",
        "226852",
        "226851",
        "226850",
        "226849",
        "226848",
        "226814",
        "226661",
        "226660",
        "226659",
        "226658",
        "226657",
        "226656",
        "226655",
        "226654",
        "226652",
        "226650",
        "226649",
        "226648",
        "226647",
        "226646",
        "226644",
        "226643",
        "226642",
        "226641",
        "226640",
        "226639",
        "226638",
        "226637",
        "226636",
        "226635",
        "226634",
        "226633",
        "226632",
        "225702",
        "226876",
        "226871",
        "226893",
        "226892",
        "226891",
        "226890",
        "226887",
        "226889",
        "226888",
        "226886",
        "XTB60X5-7/16",
        "226885",
        "226884",
        "226881",
        "226882",
        "226880",
        "226879",
        "226877",
        "226878",
        "226875",
        "226876",
        "226873",
        "XTB40X2-15/16",
        "226872",
        "226868",
        "226867",
        "226871",
        "226870",
        "226866",
        "226863",
        "226862",
        "226865",
        "226864",
        "226858",
        "226861",
        "226860",
        "226859",
        "226857",
        "226856",
        "226855",
        "226851",
        "226849",
        "226854",
        "226853",
        "226850",
        "226852",
        "226848",
        "226839",
        "226847",
        "226843",
        "226841",
        "226846",
        "226845",
        "226842",
        "226844",
        "226840",
        "226832",
        "226830",
        "226831",
        "226837",
        "226835",
        "226834",
        "226836",
        "226838",
        "226833",
        "226902",
        "226901",
        "226900",
        "226899",
        "226896",
        "226897",
        "226895",
        "226894",
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
                        res === "Bushing Length" ||
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
                        res === "Bushing Length" ||
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
                        res === "Bushing Length" ||
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
                        res === "Bushing Length" ||
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
                        res === "Bushing Length" ||
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
                        res === "Bushing Length" ||
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
                        res === "Bushing Length" ||
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
                        res === "Bushing Length" ||
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

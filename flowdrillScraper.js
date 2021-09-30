const flowdrillScraperObject = {
  url: 'https://www.flowdrill.com/usa_en/products/flowdrill?p=4',
  async scraper(browser) {
    let page = await browser.newPage();
    let scrapedData = [];
    console.log(`Navigating to ${this.url}...`);
    try {
      await page.goto(this.url, { waitUntil: "load", timeout: 200000 });

    } catch (error) {
      let data = await scrapeCurrentPage();
      console.log(data);
      return data;
    }


    async function scrapeCurrentPage() {
      // Wait for the required DOM to be rendered
      await page.waitForSelector('.main');
      // Get the link to all the required books
      let urls = await page.$$eval('.products-list > li', links => {
        // Extract the links from the data
        links = links.map(el => el.querySelector('.product-list-content > h3 > a').href)
        return links;
      });

      // Loop through each of those links, open a new page instance and get the relevant data from them
      let pagePromise = (link) => new Promise(async (resolve, reject) => {
        let dataObj = {};
        let newPage = await browser.newPage();
        /// console.log(newPage);
        await newPage.goto(link);
        dataObj['productName'] = await newPage.$eval('.product-name > h1', text => text.textContent);
        dataObj['productSku'] = await newPage.$eval('.product-sku', text => text.textContent.replace(/\n/g, ''));
        dataObj['productDescription'] = await newPage.$eval('.std.product-description__intro', text => text.textContent.replace(/\n/g, ''));
        dataObj['productAdditionalDescription'] = await newPage.$eval('.std', text => text.textContent.replace(/\n/g, ''));
        //dataObj['productAImage'] = await newPage.$eval('.product-media.span8 > img', img => img.getAttribute('src'));
        const [dm] = await newPage.$x(
          '//*[@id="product-attribute-specs-table"]/tbody/tr[2]/th'
        );
        const dmTxt = await dm.getProperty("textContent");
        const dmLabel = await dmTxt.jsonValue();
        if (dmLabel === 'Diameter') {
          const [dmv] = await newPage.$x(
            '//*[@id="product-attribute-specs-table"]/tbody/tr[2]/td'
          );
          let dmValueTxt = await dmv.getProperty("textContent");
          dmValueTxt = await dmValueTxt.jsonValue();
          dataObj["diameter"] = dmValueTxt.replace(/\n/g, '')
        }

        const [ac] = await newPage.$x(
          '//*[@id="product-attribute-specs-table"]/tbody/tr[3]/th'
        );
        const acTxt = await ac.getProperty("textContent");
        const acLabel = await acTxt.jsonValue();
        if (acLabel === 'Article code') {
          const [acv] = await newPage.$x(
            '//*[@id="product-attribute-specs-table"]/tbody/tr[3]/td'
          );
          let acValueTxt = await acv.getProperty("textContent");
          acValueTxt = await acValueTxt.jsonValue();
          dataObj["articleCode"] = acValueTxt.replace(/\n/g, '')
        }

        const [tt] = await newPage.$x(
          '//*[@id="product-attribute-specs-table"]/tbody/tr[4]/th'
        );
        const ttTxt = await tt.getProperty("textContent");
        const ttLabel = await ttTxt.jsonValue();
        if (ttLabel === 'Thread type') {
          const [ttv] = await newPage.$x(
            '//*[@id="product-attribute-specs-table"]/tbody/tr[4]/td'
          );
          let ttValueTxt = await ttv.getProperty("textContent");
          ttValueTxt = await ttValueTxt.jsonValue();
          dataObj["threadType"] = ttValueTxt.replace(/\n/g, '')
        }

        const [ts] = await newPage.$x(
          '//*[@id="product-attribute-specs-table"]/tbody/tr[5]/th'
        );
        const tsTxt = await ts.getProperty("textContent");
        const tsLabel = await tsTxt.jsonValue();
        if (tsLabel === 'Thread size') {
          const [tsv] = await newPage.$x(
            '//*[@id="product-attribute-specs-table"]/tbody/tr[5]/td'
          );
          let tsValueTxt = await tsv.getProperty("textContent");
          tsValueTxt = await tsValueTxt.jsonValue();
          dataObj["threadSize"] = tsValueTxt.replace(/\n/g, '')
        }

        const [mmt] = await newPage.$x(
          '//*[@id="product-attribute-specs-table"]/tbody/tr[6]/th'
        );
        const mmtTxt = await mmt.getProperty("textContent");
        const mmtLabel = await mmtTxt.jsonValue();
        if (mmtLabel === 'Min. Material Thickness') {
          const [mmtv] = await newPage.$x(
            '//*[@id="product-attribute-specs-table"]/tbody/tr[6]/td'
          );
          let mmtValueTxt = await mmtv.getProperty("textContent");
          mmtValueTxt = await mmtValueTxt.jsonValue();
          dataObj["minMaterialThickness"] = mmtValueTxt.replace(/\n/g, '')
        }

        const [maxmt] = await newPage.$x(
          '//*[@id="product-attribute-specs-table"]/tbody/tr[7]/th'
        );
        const maxmtTxt = await maxmt.getProperty("textContent");
        const maxmtLabel = await maxmtTxt.jsonValue();
        if (maxmtLabel === 'Max. Material Thickness') {
          const [maxmtv] = await newPage.$x(
            '//*[@id="product-attribute-specs-table"]/tbody/tr[7]/td'
          );
          let maxmtValueTxt = await maxmtv.getProperty("textContent");
          maxmtValueTxt = await maxmtValueTxt.jsonValue();
          dataObj["maxMaterialThickness"] = maxmtValueTxt.replace(/\n/g, '')
        }

        const [fn] = await newPage.$x(
          '//*[@id="product-attribute-specs-table"]/tbody/tr[8]/th'
        );
        const fnTxt = await fn.getProperty("textContent");
        const fnLabel = await fnTxt.jsonValue();
        if (fnLabel === 'Finishing') {
          const [fntv] = await newPage.$x(
            '//*[@id="product-attribute-specs-table"]/tbody/tr[8]/td'
          );
          let fnValueTxt = await fntv.getProperty("textContent");
          fnValueTxt = await fnValueTxt.jsonValue();
          dataObj["finishing"] = fnValueTxt.replace(/\n/g, '')
        }

        const [sd] = await newPage.$x(
          '//*[@id="product-attribute-specs-table"]/tbody/tr[9]/th'
        );
        const sdTxt = await sd.getProperty("textContent");
        const sdLabel = await sdTxt.jsonValue();
        if (sdLabel === 'Shaft Diameter') {
          const [sdtv] = await newPage.$x(
            '//*[@id="product-attribute-specs-table"]/tbody/tr[9]/td'
          );
          let sdValueTxt = await sdtv.getProperty("textContent");
          sdValueTxt = await sdValueTxt.jsonValue();
          dataObj["shaftDiameter"] = sdValueTxt.replace(/\n/g, '')
        }

        const [wl] = await newPage.$x(
          '//*[@id="product-attribute-specs-table"]/tbody/tr[10]/th'
        );
        const wlTxt = await wl.getProperty("textContent");
        const wlLabel = await wlTxt.jsonValue();
        if (wlLabel === 'Work Length') {
          const [wltv] = await newPage.$x(
            '//*[@id="product-attribute-specs-table"]/tbody/tr[10]/td'
          );
          let wlValueTxt = await wltv.getProperty("textContent");
          wlValueTxt = await wlValueTxt.jsonValue();
          dataObj["workLength"] = wlValueTxt.replace(/\n/g, '')
        }

        const [m1] = await newPage.$x(
          '//*[@id="product-material-specs-table"]/tbody/tr[2]/td[2]'
        );
        if (typeof (await m1) !== "undefined") {
          const m1Txt = await m1.getProperty("textContent");
          const m1Label = await m1Txt.jsonValue();



          const [ssrpm1] = await newPage.$x(
            '//*[@id="product-material-specs-table"]/tbody/tr[3]/td[1]'
          );
          let ssrpm1ValueTxt = await ssrpm1.getProperty("textContent");
          ssrpm1ValueTxt = await ssrpm1ValueTxt.jsonValue();



          const [feed] = await newPage.$x(
            '//*[@id="product-material-specs-table"]/tbody/tr[4]/td[1]'
          );
          let feedValueTxt = await feed.getProperty("textContent");
          feedValueTxt = await feedValueTxt.jsonValue();


          const [pw] = await newPage.$x(
            '//*[@id="product-material-specs-table"]/tbody/tr[5]/td[1]'
          );
          let pwValueTxt = await pw.getProperty("textContent");
          pwValueTxt = await pwValueTxt.jsonValue();

          dataObj["material1"] = m1Label.replace(/\n/g, '')
          dataObj["spindleSpeed"] = ssrpm1ValueTxt.replace(/\n/g, '')
          dataObj["feed"] = feedValueTxt.replace(/\n/g, '')
          dataObj["power"] = pwValueTxt.replace(/\n/g, '')




        }

        const [m2] = await newPage.$x(
          '//*[@id="product-material-specs-table"]/tbody/tr[2]/td[3]'
        );
        if (typeof (await m2) !== "undefined") {
          const m2Txt = await m2.getProperty("textContent");
          const m2Label = await m2Txt.jsonValue();

          const [ssrpm2] = await newPage.$x(
            '//*[@id="product-material-specs-table"]/tbody/tr[3]/td[2]'
          );
          let ssrpm2ValueTxt = await ssrpm2.getProperty("textContent");
          ssrpm2ValueTxt = await ssrpm2ValueTxt.jsonValue();



          const [feed2] = await newPage.$x(
            '//*[@id="product-material-specs-table"]/tbody/tr[4]/td[2]'
          );
          let feed2ValueTxt = await feed2.getProperty("textContent");
          feed2ValueTxt = await feed2ValueTxt.jsonValue();


          const [pw2] = await newPage.$x(
            '//*[@id="product-material-specs-table"]/tbody/tr[5]/td[2]'
          );
          let pw2ValueTxt = await pw2.getProperty("textContent");
          pw2ValueTxt = await pw2ValueTxt.jsonValue();

          dataObj["material2"] = m2Label.replace(/\n/g, '')
          dataObj["spindleSpeed2"] = ssrpm2ValueTxt.replace(/\n/g, '')
          dataObj["feed2"] = feed2ValueTxt.replace(/\n/g, '')
          dataObj["power2"] = pw2ValueTxt.replace(/\n/g, '')

        }
        resolve(dataObj);
        await newPage.close();
      });

      for (link in urls) {
        // console.log(urls[link]);
        if (urls[link] != null) {
           console.log("got in");
           console.log(urls[link]);
          let currentPageData = await pagePromise(urls[link]);
          scrapedData.push(currentPageData);
        }
      }
      let nextButtonExist = false;
      let newPageLink;
      try {
        console.log('inside doing');
        const [nextButton] = await page.$x("/html/body/div[3]/div/div[3]/div/div/div[2]/div/div[2]/div/div[2]/div/ul/li[6]/a");
        console.log(await nextButton);
        const newPage = await nextButton.getProperty("href");
        console.log(newPage);
        newPageLink = await newPage.jsonValue();
        console.log(`Next page link is: ${await newPageLink}`);
        nextButtonExist = false;
        if (await newPageLink === 'https://www.flowdrill.com/usa_en/products/flowdrill?p=6') {
          console.log('End of life');
          nextButtonExist = false;
        }
        console.log('continue');

      } catch (e) {
        console.log(e);
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
   // console.log(data);
    return data;
  },
}


module.exports = flowdrillScraperObject;
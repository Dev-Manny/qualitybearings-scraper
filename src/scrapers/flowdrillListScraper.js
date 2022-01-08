const fs = require('fs');
const flowdrillListScraperObject = {

    async scraper(browser) {
        let scrapedData = [];
        let newPage;
        console.log(`Navigating to ${this.url}...`);


        async function scrapeCurrentPage() {
            // Wait for the required DOM to be rendered
            // await page.waitForSelector('.main');
            // Get the link to all the required books
            let urls = [
                "43UNC4-40",
                "43UNC5-40",
                "43UNC6-32",
                "43UNC8-32",
                "43UNC10-24",
                "43UNC12-24",
                "43UNC1/4-20",
                "43UNC5/16-18",
                "43UNC3/8-16",
                "43UNC7/16-14",
                "43UNC1/2-13",
                "43UNC9/16-12",
                "43UNC5/8-11",
                "43UNC3/4-10",
                "44UNF4-48",
                "44UNF5-44",
                "44UNF6-40",
                "44UNF8-36",
                "44UNF10-32",
                "44UNF12-28",
                "44UNF1/4-28",
                "44UNF5/16-24",
                "44UNF3/8-24",
                "44UNF7/16-20",
                "44UNF1/2-20",
                "44UNF9/16-18",
                "44UNF5/8-18",
                "44UNF3/4-16",
                "40M04x0.7",
                "40M05x0.8",
                "200530",
                "100530",
                "210530",
                "110530",
                "40M06x1.0",
                "40M08X1.25",
                "40M10x1.5",
                "40M12x1.75",
                "40M16x2.0",
                "41MF18x1.5",
                "210700",
                "110700",
                "45NPT1/16TIN",
                "45NPT1/8TIN",
                "45NPT1/4",
                "211580",
                "111580",
                "45NPT3/8",
                "211960",
                "111960",
                "45NPT1/2",
                "212490",
                "112490",
                "45NPT3/4",
                "203140",
                "103140",
                "213140",
                "113140",
                "45NPT1",
                "50MC2",
                "50CYL2",
                "50MC3",
                "50CYL3",
                "50CAT40",
                "80FDKS1KG",
                "81FDKSF1L",
                "81FTMZ1L",
                "6047006",
                "6047008",
                "6047010",
                "6047012",
                "6047014",
                "6047016",
                "6047018",
                "6047020",
                "6043006",
                "6043008",
                "6043010",
                "6043012",
                "6043014",
                "6043016",
            ];

            // Loop through each of those links, open a new page instance and get the relevant data from them
            let pagePromise = (link, prodId) => new Promise(async (resolve, reject) => {
                let dataObj = {};
                let newPage = await browser.newPage();
                /// console.log(newPage);
                await newPage.goto(link, { waitUntil: "load", timeout: 100000 });

                let [newLink] = await newPage.$x('//*[@id="products-list"]/li/div/div/div/div[1]/h3/a');
                if (typeof (await newLink) !== "undefined") {
                    link = await newLink.getProperty("href")
                    const linkTitle = await link.jsonValue();
                    await newPage.goto(linkTitle)
                    console.log(linkTitle)

                    let [body] = await newPage.$x('//*[@id="product-attribute-specs-table"]/tbody');
                    body = await body.getProperty("children");
                    body = await (await body.getProperty("length")).jsonValue()

                    // dataObj['productName'] = await newPage.$eval('.product-name > h1', text => text.textContent);
                    // dataObj['productSku'] = await newPage.$eval('.product-sku', text => text.textContent.replace(/\n/g, ''));
                    dataObj['description'] = await newPage.$eval('.product-name', text => text.textContent.replace(/\n/g, ''));
                    dataObj['additional_description'] = await newPage.$eval('.std', text => text.textContent.replace(/\n/g, ''));

                    for (i = 1; i <= body; i++) {
                        let title = `//*[@id="product-attribute-specs-table"]/tbody/tr[${i}]/th`;
                        let body = `//*[@id="product-attribute-specs-table"]/tbody/tr[${i}]/td`;

                        const [header] = await newPage.$x(title)
                        const headerSpec = await header.getProperty("textContent");
                        let data = await headerSpec.jsonValue();
                        data = data.replace(/[^a-zA-Z ]/g, "").trim();


                        const [val] = await newPage.$x(body);
                        const bodySpec = await val.getProperty("textContent");
                        let value = (await bodySpec.jsonValue()).trim();
                        dataObj[data] = value;
                    }
                } else {
                    dataObj["Product ID"] = prodId;
                    resolve(dataObj);
                }

                console.log(dataObj)
                resolve(dataObj);
                await newPage.close();
            });

            for (link in urls) {
                // console.log(urls[link]);
                if (urls[link] != null) {
                    console.log("got in");
                    console.log(urls[link]);
                    let currentPageData = await pagePromise(`https://www.flowdrill.com/eu_en/catalogsearch/result/?q=${urls[link]}`, urls[link]);
                    scrapedData.push(currentPageData);
                }
            }

            //  await newPage.close();
            return scrapedData;
        }

        let data = await scrapeCurrentPage();
        // console.log(data);
        fs.writeFile("output.json", JSON.stringify(data), 'utf8', function (err) {
            if (err) {
                console.log("An error occured while writing JSON Object to File.");
                return console.log(err);
            }

            console.log("JSON file has been saved.");
        });
        return data;
    },
}


module.exports = flowdrillListScraperObject;
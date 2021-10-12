const dodgeScraperObject = {
    async scraper(browser) {
        let scrapedData = [];
        let newPage;

        // Wait for the required DOM to be rendered
        async function scrapeCurrentPage() {
            //Loop through each of those links, open a new page instance and get the relevant data from them
            let urls = [
                "747948",
                "747952",
                "023310",
                "138647",
                "138663",
                "138662",
                "138648",
                "141542",
                "137786",
                "141691",
                "141692",
                "137826",
                "141755",
                "141230",
                "128883",
                "141339",
                "137883",
                "141531",
                "141532",
                "032881",
                "032887",
                "137890",
                "141611",
                "141563",
                "141507",
                "141381",
                "077820",
                "138595",
                "138594",
                "068483",
                "141059",
                "141661",
                "140875",
                "034525",
                "140767",
                "075745",
                "075744",
                "075743",
                "075742",
                "075741",
                "075740",
                "075739",
                "075738",
                "078031",
                "140692",
                "140691",
                "140690",
                "140639",
                "140682",
            ];

            let pagePromise = (link, prodId) =>
                new Promise(async (resolve, reject) => {
                    console.log("start to scrape");
                    let dataObj = {};
                    let itemTitle;
                    let b;
                    let res;
                    newPage = await browser.newPage();
                    // console.log(newPage);
                    await newPage.goto(link, { waitUntil: "load", timeout: 100000 });

                    const [headerTitle] = await newPage.$x(
                        `//*[@id="Content_C004_Col00"]/div/div[3]/div[2]/div/div/div[1]/div/div/div[2]`
                    );

                    if (typeof (await headerTitle) !== "undefined") {

                        const headerTitleChildren = await headerTitle.getProperty("children");

                        let headerLength = await headerTitleChildren.getProperty("length");
                        headerLength = await headerLength.jsonValue()

                        for (i = 1; i <= headerLength; i++) {
                            let q = `//*[@id="Content_C004_Col00"]/div/div[3]/div[2]/div/div/div[1]/div/div/div[2]/div[${i}]/ul`

                            const [innerTab] = await newPage.$x(q);
                            const innerChildren = await innerTab.getProperty("children");


                            const innerLength = await (
                                await innerChildren.getProperty("length")
                            ).jsonValue();

                            for (j = 1; j <= innerLength; j++) {
                                let x = `//*[@id="Content_C004_Col00"]/div/div[3]/div[2]/div/div/div[1]/div/div/div[2]/div[${i}]/ul/li[${j}]/dl/dt`;
                                let y = `//*[@id="Content_C004_Col00"]/div/div[3]/div[2]/div/div/div[1]/div/div/div[2]/div[${i}]/ul/li[${j}]/dl/dd`;

                                const [header] = await newPage.$x(x);
                                const headerSpec = await header.getProperty("textContent");
                                let data = await headerSpec.jsonValue();
                                data = data.replace(/[^a-zA-Z ]/g, "").trim();


                                const [body] = await newPage.$x(y);
                                const bodySpec = await body.getProperty("textContent");
                                value = await bodySpec.jsonValue();
                                dataObj[data] = value;
                            }

                        }
                        dataObj["Product ID"] = prodId;

                        resolve(dataObj);
                        await newPage.close();
                    } else {
                        dataObj["Product ID"] = prodId;
                        resolve(dataObj);
                        await newPage.close();
                    }
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

module.exports = dodgeScraperObject;

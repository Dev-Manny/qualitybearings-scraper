const dodgeScraperObject = {
    async scraper(browser) {
        let scrapedData = [];
        let newPage;

        // Wait for the required DOM to be rendered
        async function scrapeCurrentPage() {
            //Loop through each of those links, open a new page instance and get the relevant data from them
            let urls = [
                "421244",
"023291",
"023289",
"023288",
"023286",
"023284",
"023283",
"023282",
"023281",
"023279",
"023278",
"023277",
"023275",
"023273",
"023271",
"023311",
"023307",
"023304",
"023303",
"023301",
"023300",
"023299",
"023297",
"033626",
"033624",
"033623",
"033622",
"033619",
"033618",
"033617",
"033616",
"033612",
"033611",
"033610",
"033601",
"033600",
"033599",
"033597",
"033596",
"033594",
"033592",
"033591",
"033590",
"033587",
"124253",
"124429",
"123177",
"124250",
"124427",
"124148",
"124394",
"066526",
"066298",
"066524",
"066297",
"066523",
"066521",
"066296",
"066519",
"066517",
"066515",
"066295",
"066514",
"066512",
"066326",
"066511",
"066507",
"066293",
"066506",
"066504",
"066503",
"066502",
"066312",
"066499",
"066501",
"066585",
"066322",
"066584",
"066582",
"066581",
"066580",
"066578",
"066576",
"066320",
"066574",
"066573",
"066572",
"066570",
"066569",
"066567",
"066564",
"066317",
"066563",
"066316",
"066314",
"066559",
"066561",
"066315",
"066463",
"066460",
"066459",
"066286",
"066457",
"066455",
"066285",
"066284",
"066283",
"066450",
"066282",
"066448",
"066281",
"066446",
"066280",
"066445",
"066325",
"066471",
"066469",
"066288",
"066466",
"066465",
"066287",
"066588",
"087197",
"087220",
"087218",
"087217",
"087216",
"087215",
"087195",
"087194",
"087207",
"087199",
"087202",
"087201",
"087212",
"087230",
"087211",
"087227",
"087226",
"087225",
"087223",
"087222",
"087221",
"065306",
"065280",
"065305",
"065304",
"065277",
"065276",
"065275",
"065288",
"065272",
"065287",
"065268",
"065267",
"065266",
"065265",
"065285",
"065262",
"065258",
"065282",
"065256",
"065254",
"069075",
"069074",
"069071",
"069067",
"069049",
"069048",
"069047",
"069046",
"069045",
"069043",
"069039",
"069064",
"069038",
"069037",
"069063",
"069062",
"069032",
"069061",
"069060",
"069058",
"069057",
"023514",
"023513",
"023512",
"023713",
"023508",
"023507",
"023712",
"023708",
"023705",
"023703",
"023700",
"023496",
"023495",
"023494",
"023490",
"023489",
"023488",
"023487",
"023485",
"023483",
"023482",
"023481",
"023480",
"060395",
"023533",
"060394",
"023530",
"060393",
"060392",
"023528",
"023527",
"023525",
"023524",
"023522",
"023521",
"023519",
"023517",
"023715",
"023516",
"023560",
"023559",
"023558",
"023556",
"023554",
"023552",
"023550",
"023549",
"023545",
"023543",
"023570",
"023569",
"023567",
"023565",
"023564",
"023506",
"023505",
"023502",
"023500",
"023499",
"023498",
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

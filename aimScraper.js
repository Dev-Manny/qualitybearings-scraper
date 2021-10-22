const fs = require('fs');

const scrap = async (newPage, table, dimension, dataObj, prodId) => {
    const tableSpec = await table.getProperty("children");
    const specLength = await (
        await tableSpec.getProperty("length")
    ).jsonValue();

    const dimensionSpec = await dimension.getProperty("children");
    const dimensionLength = await (await dimensionSpec.getProperty("length")).jsonValue()

    for (i = 1; i <= specLength; i++) {
        let title = `//*[@id="plp-item-page-specs"]/div[4]/div[1]/div/table/tbody/tr[${i}]/td[1]/h2/strong`
        let body = `//*[@id="plp-item-page-specs"]/div[4]/div[1]/div/table/tbody/tr[${i}]/td[2]/span/span[2]/span`

        const [header] = await newPage.$x(title);
        const headerSpec = await header.getProperty("textContent");
        let data = await headerSpec.jsonValue();
        data = data.replace(/[^a-zA-Z ]/g, "").trim();


        const [val] = await newPage.$x(body);
        const bodySpec = await val.getProperty("textContent");
        let value = await bodySpec.jsonValue();
        dataObj[data] = value;
    }

    for (j = 1; j <= dimensionLength; j++) {
        let title = `//*[@id="plp-item-page-specs"]/div[4]/div[2]/div/table/tbody/tr[${j}]/td[1]/h2/strong`
        let body = `//*[@id="plp-item-page-specs"]/div[4]/div[2]/div/table/tbody/tr[${j}]/td[2]/span/span[2]/span`

        const [header] = await newPage.$x(title);
        const headerSpec = await header.getProperty("textContent");
        let data = await headerSpec.jsonValue();
        data = data.replace(/[^a-zA-Z ]/g, "").trim();


        const [val] = await newPage.$x(body);
        const bodySpec = await val.getProperty("textContent");
        let value = await bodySpec.jsonValue();
        dataObj[data] = value;
    }
    dataObj["Product ID"] = prodId;

    return dataObj

}

const aimScraperObject = {
    async scraper(browser) {
        let scrapedData = [];
        let newPage;

        // Wait for the required DOM to be rendered
        async function scrapeCurrentPage() {
            //Loop through each of those links, open a new page instance and get the relevant data from them
            let urls = [
                "BR4-12FS",
                "UEX11-35",
                "UEX10-31",
                "UEX09-28",
                "UEX09-27",
                "UEX08-24",
                "UEX07-23",
                "UEX06-19",
                "UEX05-16",
                "UK328",
                "UK326",
                "UK322+HA322",
                "UC218-56C4HR23",
                "UK324",
                "UC318-55",
                "UK322",
                "UK320+HA2320",
                "MUC213-40",
                "MUC213",
                "UK319",
                "UK318+HA2318",
                "MUC212-39",
                "MUC212",
                "UKX20",
                "UK318",
                "UG314-43",
                "UG314",
                "MUC211-35",
                "MUC211-32",
                "MUC211",
                "UK316+HA2316",
                "UK317",
                "UKX18",
                "MSER208-24RF",
                "UC314-43",
                "UK218",
                "UK316",
                "UE208-24MZ20RF",
                "MUC210RF",
                "MUC210-32RF",
                "MUC210-31RF",
                "MUC210-30RF",
                "UK215C4HR5",
                "UK216+HA2316",
                "UK315",
                "UK217",
                "MSER207-23RF",
                "MSER207-20RF",
                "UE208-24MZ20",
                "UE207-23MZ20RF",
                "UE207-20MZ20RF",
                "UKX17",
                "MUC209-28RT",
                "MSER207-20FS",
                "UC212C4HR5FB",
                "UC210-32MZ20RF",
                "UC210-31MZ20RF",
                "MUC208RF",
                "UK313+HA2313",
                "MUC207-21RF",
                "UE206-20MZ20RF",
                "UE206-19MZ20RF",
                "MUC207RF",
                "MUC207-22RF",
                "UE207-23MZ20",
                "UE207-20MZ20",
                "UK216",
                "MB8",
                "UKX16",
                "UC210-32MZ20",
                "UC210-31MZ20",
                "UE205-16MZ20RF",
                "MSER206-19RF",
                "UE206-19MZ20",
                "UK313",
                "UK312+HA2312",
                "UK215",
                "UC208-24MZ20RF",
                "UC209-28MZ20",
                "UC209-27MZ20",
                "UKX15",
                "UE204-12MZ20RF",
                "MSER205-16RF",
                "MSER204-12RF",
                "MSER202-10RF",
                "UC209-C4HR5FB",
                "MUC206RF",
                "MUC206-19RF",
                "MUC206-18RF",
                "MSER205-16FS",
                "UK311+HA2311",
                "UC208-24MZ20",
                "UC207-23MZ20RF",
                "UC207-22MZ20RF",
                "UC207-20MZ20RF",
                "MSER204-12FS",
                "UK312",
                "MUC205-15RF",
                "UE204-12MZ20",
                "SUE211-35FSAM1",
                "SUE211-32FSAM1",
                "SUE210FSAM1",
                "UC207-23MZ20",
                "UC207-22MZ20",
                "UC207-20MZ20",
                "UKX13",
                "SER212-39FSX",
                "SER212-38FSX",
                "SER212-36FSX",
                "SUE210-31FSAM1",
                "MUC205RF",
                "MUC205-14RF",
                "UK310+HA2310",
                "UK311",
                "UK213",
                "SER211-32FSXAM1",
                "UC206-20MZ20RF",
                "UC206-19MZ20RF",
                "MUC204RF",
                "MUC203RF",
                "MUC202RF",
                "MUC202-10RF",
                "MUC201RF",
                "MUC201-8RF",
                "UK310",
                "SER211-35FSX",
                "SER211-32FSX",
                "UCX11-32",
                "UC211-35MZ2",
                "SUE209FS",
                "UK309+HA2309",
                "SUE208FSAM1",
                "UC206-20MZ20",
                "UC206-19MZ20",
                "UKX12",
                "UK212",
                "SUE208-24FSAM1",
                "UC205-16MZ20RF",
                "SER211-32FSAM1",
                "SUE207-23FSAM1",
                "SUE207-22FSAM1",
                "SUE207-20FSAM1",
                "SER210FSAM1",
                "SER210-31FSAM1",
                "SER210-30FSAM1",
                "UG210RT",
                "UG210-32RT",
                "UG210-31RT",
                "UG210-30RT",
                "UK308+HA2308",
                "UC205-16MZ20",
                "UC210MZ2RF",
                "UC210-32MZ2RF",
                "UC210-31MZ2RF",
                "UC210-30MZ2RF",
                "UK209+H309",
                "UC204-12MZ20RF",
                "UC202-10MZ20RF",
                "UC201-8MZ20RF",
                "UC211-32FS",
                "UG209RT",
                "UG209-28RT",
                "UG209-27RT",
                "UG209-26RT",
                "SUE206FSAM1",
                "UKX11",
                "UK211",
                "SUE206-20FSAM1",
                "SUE206-19FSAM1",
                "SUE206-18FSAM1",
                "UK309",
                "SER208-24FSXAM1",
                "UC204-12MZ20",
                "UC202-10MZ20",
                "UC201-8MZ20",
                "SER209-28FSX",
                "UK307+HA2307",
                "UG208RT",
                "UG208-24RT",
                "SER208FSX",
                "SER208-24FSX",
                "UC210RT",
                "UC210-32RT",
                "UC210-31RT",
                "UC210-30RT",
                "KHR208NR",
                "UC208MZ2RF",
                "UC208-24MZ2RF",
                "UK210",
                "UK207+H307",
                "SER208FSAM1",
                "SER208-24FSAM1",
                "SER207-20FSXAM1",
                "SUE205FSAM1",
                "UKX10",
                "UK306+HS2306",
                "UK306+HA2306",
                "UC209RT",
                "UC209-28RT",
                "UC209-27RT",
                "UC209-26RT",
                "UK308",
                "SUE205-16FSAM1",
                "SUE204FSX",
                "B7-22MZ2",
                "SER207FSX",
                "SER207-22FSX",
                "SER207-20FSX",
                "UR208-24RT",
                "UC208RT",
                "UC208-24RT",
                "UC208-25FS",
                "UG207RT",
                "UG207-23RT",
                "UG207-22RT",
                "UG207-20RT",
                "SER207FSAM1",
                "SER207-23FSAM1",
                "UC207FS",
                "SUE204-12FSAM1",
                "UK209",
                "UC207MZ2RF",
                "UC207-23MZ2RF",
                "UC207-22MZ2RF",
                "UC207-21MZ2RF",
                "UC207-20MZ2RF",
                "UE205-16FS",
                "SER206-20FSXAM1",
                "UC207-23FS",
                "UC207-20FS",
                "UK307",
                "UC207RT",
                "UC207-23RT",
                "UC207-22RT",
                "UC207-21RT",
                "UC207-20RT",
                "UKX09",
                "SER205FSXAM1",
                "SER205-16FSXAM1",
                "UR207-20FS",
                "SER206FSX",
                "SER206-20FSX",
                "UK208",
                "KHR206NR",
                "SER206FSAM1",
                "SER206-20FSAM1",
                "SER206-19FSAM1",
                "SER206-18FSAM1",
                "UKX08",
                "SER205FSX",
                "SER205-16FSX",
                "SER205-14FSX",
                "UC206MZ2RF",
                "UC206-20MZ2RF",
                "UC206-19MZ2RF",
                "UC206-18MZ2RF",
                "UC206-17MZ2RF",
                "SER204-12FSXAM1",
                "UKX07",
                "KHR205NR",
                "UK306",
                "UK207",
                "UR205-16FS",
                "SER205FSAM1",
                "SER205-16FSAM1",
                "SER205-14FSAM1",
                "SER204FSX",
                "SER204-12FSX",
                "SER202-10FSX",
                "SER201-8FSX",
                "UC205MZ2RF",
                "UC205-16MZ2RF",
                "UC205-14MZ2RF",
                "KHR204NR",
                "SER204FSAM1",
                "SER204-12FSAM1",
                "SER202-10FSAM1",
                "BR5-16NR",
                "UKX06",
                "UK305",
                "UC204MZ2RF",
                "UC204-12MZ2RF",
                "UC203MZ2RF",
                "UC202MZ2RF",
                "UC202-10MZ2RF",
                "UC201-8MZ2RF",
                "UK206",
                "UC206-20FS",
                "BR3NR",
                "UKX05",
                "UK205",
                "BR2-10NR",
                "BR1NR",
                "BR1-8NR",
                "URW202-10",
                "URW201-8",
                "BR3",
                "BR2-10",
                "BR2",
                "BR1-8",
                "BR1",
                "B3",
                "B2-10",
                "B2",
                "B1-8",
                "B1",
                "BR4-12",
                "BR4",
                "B4-12",
                "B4",
                "BR5-16",
                "BR5-15",
                "BR5-14",
                "BR5",
                "B5-16",
                "B5-15",
                "B5-14",
                "B5",
                "U000",
                "KHR204-12",
                "KHR204",
                "KHR203",
                "KHR202-10",
                "KHR202",
                "KHR201-8",
                "KHR201",
                "KH204-12",
                "KH204",
                "KH203",
                "KH202-10",
                "KH202",
                "KH201-8",
                "KH201",
                "UR204-12",
                "UR204",
                "UCW203-11",
                "UCW203",
                "UCW202-9",
                "UCW202-10",
                "UCW202",
                "UCW201-8",
                "UCW201",
                "UC204-12",
                "UC204",
                "UC203-11",
                "UC203",
                "UC202-10",
                "UC202",
                "UC201-8",
                "UC201",
                "U001",
                "U002",
                "KHR205-15",
                "KHR205-14",
                "KHR205",
                "KH205-15",
                "KH205-14",
                "KH205",
                "KHR205-16",
                "KH205-16",
                "UR205-16",
                "UR205",
                "UC205-16",
                "UC205-15",
                "UC205-14",
                "UC205",
                "K000",
                "B1-8MZ2",
                "B2-10MZ2",
                "UGW202-10",
                "UGW201-8",
                "UG204-12",
                "UG204",
                "UC203MZ2",
                "UC204MZ2",
                "UC204-12MZ2",
                "UC202MZ2",
                "UC202-10MZ2",
                "UC201-8MZ2",
                "B4-12MZ2",
                "K001",
                "U003",
                "BR6-20",
                "BR6-19",
                "BR6-18",
                "BR6",
                "B6-20",
                "B6-19",
                "B6-18",
                "B6-17",
                "B6",
                "K002",
                "UR206-20",
                "UR206",
                "UC206-20",
                "UC206-19",
                "UC206-18",
                "UC206-17",
                "UC206",
                "UC205MZ2",
                "UC205-16MZ2",
                "UC205-14MZ2",
                "SER204-12",
                "SER202-10",
                "SER201-8",
                "K003",
                "URE004-12",
                "URE004",
                "U004",
                "B5-16MZ2",
                "KHR206-20",
                "KHR206-19",
                "KHR206-18",
                "KHR206-17",
                "KHR206",
                "KH206-20",
                "KH206-19",
                "KH206-18",
                "KH206",
                "SER204",
                "SER203",
                "SER202",
                "SER201",
                "UG205-16",
                "UG205-15",
                "UG205-14",
                "UG205",
                "SER205-16",
                "SER205-15",
                "SER205-14",
                "SER204-12FS",
                "SER201-8FS",
                "BR7-23",
                "BR7-22",
                "BR7-21",
                "BR7-20",
                "BR7",
                "B7-23",
                "B7-22",
                "B7-21",
                "B7-20",
                "B7",
                "PAV205-16",
                "K004",
                "UC206MZ2",
                "UC206-20MZ2",
                "UC206-19MZ2",
                "UC206-18MZ2",
                "UC206-17MZ2",
                "U005",
                "SER205",
                "SER204FS",
                "SER203FS",
                "SER202FS",
                "SER201FS",
                "K005",
                "UR207-23",
                "UR207-20",
                "UR207",
                "UC207-23",
                "UC207-22",
                "UC207-21",
                "UC207-20",
                "UC207",
                "SER205-16FS",
                "SER205-15FS",
                "SER206-20",
                "SER206-19",
                "SER206-18",
                "SER206-17",
                "UG206-20",
                "UG206-19",
                "UG206-18",
                "UG206",
                "B6-19MZ2",
                "B6-18MZ2",
                "B6-20MZ2",
                "SER205FS",
                "SER206",
                "U006",
                "SER206-20FS",
                "SER206-19FS",
                "SER206-18FS",
                "SER206-17FS",
                "KHR207-23",
                "KHR207-22",
                "KHR207-21",
                "KHR207-20",
                "KHR207",
                "KH207-23",
                "KH207-22",
                "KH207-21",
                "KH207-20",
                "KH207",
                "UCX05-16",
                "UCX05",
                "SER205-14FS",
                "U007",
                "UC207MZ2",
                "UC207-23MZ2",
                "UC207-22MZ2",
                "UC207-21MZ2",
                "UC207-20MZ2",
                "K006",
                "SER207-23",
                "SER207-22",
                "SER207-21",
                "SER207-20",
                "UR208-24",
                "UR208",
                "UC208-25",
                "UC208-24",
                "UC208",
                "UK205+HE2305",
                "UK205+HA2305",
                "UK205+H2305",
                "SUE204",
                "UE204",
                "UCX06-20",
                "UCX06-19",
                "UCX06-18",
                "UCX06",
                "KHR208-24",
                "KHR208",
                "KH208-24",
                "KH208",
                "UE204-12",
                "SUE204-12",
                "SER207-23FS",
                "SER207-21FS",
                "SER207-20FS",
                "SER207",
                "UKX05+HE2305",
                "UKX05+HA2305",
                "UKX05+H2305",
                "UR209",
                "UC209-28",
                "UC209-27",
                "UC209-26",
                "UC209",
                "SUE205",
                "UE205",
                "UG207-23",
                "UG207-22",
                "UG207-21",
                "UG207-20",
                "UG207",
                "SUE205-16",
                "UE205-16",
                "UE205-15",
                "UE205-14",
                "SUE204-12FS",
                "UC204C4HR5",
                "UC204-12C4HR5",
                "UC203C4HR5",
                "UC202C4HR5",
                "UC202-10C4HR5",
                "UC201C4HR5",
                "UC201-8C4HR5",
                "UK305+HE2305",
                "UK305+H2305",
                "SER207FS",
                "UC305-16",
                "UC305",
                "B8-24",
                "B8",
                "KHR209-28",
                "KHR209-27",
                "KHR209-26",
                "KHR209",
                "KH209-28",
                "KH209-27",
                "KH209-26",
                "KH209",
                "SUE205-16FS",
                "UK206+HS2306",
                "UK206+HE2306",
                "UK206+HA2306",
                "UK206+H2306",
                "UC208MZ2",
                "UC208-24MZ2",
                "UKX06+HS2306",
                "UKX06+HE2306",
                "UKX06+HA2306",
                "UKX06+H2306",
                "SUE204FS",
                "SER208-25",
                "SER208-24",
                "SUE205FS",
                "UC210-32",
                "UC210-31",
                "UC210-30",
                "UC210",
                "UG208-24",
                "UG208",
                "B7-23MZ2",
                "B7-20MZ2",
                "UCX07-23",
                "UCX07-22",
                "UCX07-20",
                "UCX07",
                "UC209MZ2",
                "UC209-28MZ2",
                "UC209-27MZ2",
                "SER208-25FS",
                "SER208-24FS",
                "SER210-30FS",
                "SER208",
                "UC205C4HR5",
                "UC205-16C4HR5",
                "UC205-15C4HR5",
                "UC205-14C4HR5",
                "PAV206-20",
                "KHR210-31",
                "KHR210-30",
                "KHR210",
                "KH210-31",
                "KH210-30",
                "KH210",
                "UC306-19",
                "UC306",
                "UK306+HE2306",
                "UK306+H2306",
                "MU002",
                "SER209-28",
                "SER209-27",
                "SER209-26",
                "MU001",
                "MU000",
                "UG209-28",
                "UG209-27",
                "UG209-26",
                "UG209",
                "UK207+HS2307",
                "UK207+HA2307",
                "UK207+H2307",
                "SUE206",
                "UE206",
                "UCX08-24",
                "UCX08",
                "SUE206-20",
                "SUE206-19",
                "SUE206-18",
                "UE206-20",
                "UE206-19",
                "UE206-18",
                "UKX07+HS2307",
                "UKX07+HA2307",
                "UKX07+H2307",
                "MU003",
                "UG210-32",
                "UG210-31",
                "UG210-30",
                "UG210",
                "SER209-27FS",
                "SER209-26FS",
                "SER209",
                "UC210MZ2",
                "UC210-32MZ2",
                "UC210-31MZ2",
                "UC210-30MZ2",
                "SUE206-20FS",
                "SUE206-19FS",
                "SUE206-18FS",
                "B8-24MZ2",
                "SER210-31",
                "SER210-30",
                "UC206C4HR5",
                "UC206-20C4HR5",
                "UC206-19C4HR5",
                "UC206-18C4HR5",
                "UC307-23",
                "UC307-20",
                "UC307",
                "SER209FS",
                "UKX08+HS2308",
                "UKX08+HE2308",
                "UKX08+HA2308",
                "UKX08+H2308",
                "UC211-35",
                "UC211-34",
                "UC211-32",
                "UC211",
                "UK307+HS2307",
                "UK307+H2307",
                "MU004",
                "UCX09-28",
                "UCX09-27",
                "UCX09-26",
                "UCX09",
                "SUE206FS",
                "UK208+HS2308",
                "UK208+HE2308",
                "UK208+HA2308",
                "UK208+H2308",
                "SER210",
                "KHR211-35",
                "KHR211-32",
                "KH211-35",
                "KH211-34",
                "KH211-32",
                "KH211",
                "UKX09+HS2309",
                "UKX09+HE2309",
                "UKX09+HA2309",
                "UKX09+H2309",
                "SER210FS",
                "SER210-31FS",
                "SUE207",
                "UE207",
            ];

            let pagePromise = (link, prodId) =>
                new Promise(async (resolve, reject) => {
                    console.log("start to scrape");
                    let dataObj = {};
                    newPage = await browser.newPage();

                    await newPage.goto(link, { waitUntil: "load", timeout: 100000 });

                    await newPage.waitForSelector('input[name=keyword]');

                    await newPage.$eval('input[name=keyword]', (el, b) => { el.value = b }, prodId);


                    await newPage.click('input[name="search_btn"]');
                    await newPage.waitForSelector('#plp-container');

                    const [table] = await newPage.$x(
                        `//*[@id="plp-item-page-specs"]/div[4]/div[1]/div/table/tbody`
                    );

                    const [dimension] = await newPage.$x(
                        `//*[@id="plp-item-page-specs"]/div[4]/div[2]/div/table/tbody`
                    );

                    if (typeof (await table) !== "undefined") {
                        console.log('not undefined')
                        dataObj = await scrap(newPage, table, dimension, dataObj, prodId);
                        // resolve(dataObj);
                        // await newPage.close();

                    } else {
                        console.log('i am scraping')
                        const [search] = await newPage.$x(
                            `//*[@id="plp-container"]/nav[2]/h1/span`
                        );

                        if (typeof (await search) !== "undefined") {
                            const [divs] = await newPage.$x(`//*[@id="plp-search-results-list"]/div[4]`)
                            if(typeof (await divs) !== "undefined"){
                                const divsSpec = await divs.getProperty("children")
                            const divsLength = await (await divsSpec.getProperty("length")).jsonValue()

                            for (k = 1; k <= divsLength; k++) {
                                let v = `//*[@id="plp-search-results-list"]/div[4]/div[${k}]/span[1]/a`
                                const [link] = await newPage.$x(v)
                                if (typeof (await link) !== "undefined") {
                                    const linkSpec = await link.getProperty("href")
                                    const newLink = await linkSpec.jsonValue()
                                    await newPage.goto(newLink);

                                    const [title] = await newPage.$x(`//*[@id="plp-product-title"]/h1`)

                                    if (typeof (await title) !== "undefined") {
                                        const titleSpec = await title.getProperty("textContent");
                                        let tit = await titleSpec.jsonValue();
                                        let wordAfter = tit.substr(tit.indexOf("# ") + 1).trim()
                                        let prodIdToComp = wordAfter.substring(0, wordAfter.indexOf(","))
                                        console.log(prodId)
                                        console.log(prodIdToComp)
                                        if (prodId !== prodIdToComp) {
                                            // go back to original page
                                            await newPage.goBack();
                                        } else {
                                            console.log('do something')
                                            const [table] = await newPage.$x(
                                                `//*[@id="plp-item-page-specs"]/div[4]/div[1]/div/table/tbody`
                                            );

                                            const [dimension] = await newPage.$x(
                                                `//*[@id="plp-item-page-specs"]/div[4]/div[2]/div/table/tbody`
                                            );

                                            dataObj = await scrap(newPage, table, dimension, dataObj, prodId);

                                            break;
                                        }
                                    } else {
                                        dataObj["Product ID"] = prodId;
                                        //await newPage.goBack();
                                    }
                                } else {
                                    dataObj["Product ID"] = prodId;
                                    //await newPage.goBack();
                                }
                            }
                            }else{
                                 dataObj["Product ID"] = prodId;
                            }
                            

                        } else {
                            console.log('out')
                            console.log(prodId)
                            dataObj["Product ID"] = prodId;
                            resolve(dataObj);
                            //  await newPage.close();
                        }



                    }
                    console.log(dataObj)
                    resolve(dataObj);
                    await newPage.close();


                });


            for (link in urls) {

                console.log(urls[link]);
                if (urls[link] != null) {
                    let currentPageData = await pagePromise(
                        `https://catalog.amibearings.com/`,
                        urls[link]
                    );

                    scrapedData.push(currentPageData);
                }
            }

            await newPage.close();
            return scrapedData;
        }
        let data = await scrapeCurrentPage();
        fs.writeFile("output.json", JSON.stringify(data), 'utf8', function (err) {
            if (err) {
                console.log("An error occured while writing JSON Object to File.");
                return console.log(err);
            }

            console.log("JSON file has been saved.");
        });
        return data;
    },
};

module.exports = aimScraperObject;

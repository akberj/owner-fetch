// const rp = require("request-promise"),
//   cheerio = require("cheerio"),
//   table = require("cli-table");
// const options = {
//   url: "https://www.allbiz.com/business/golden-touch-car-wash-inc-718-855-8400",
//   json: true,
// };

// rp(options).then((data) => {
//   let promise = [];
//   let userData = [];
//   console.log(userData);
//   process.stdout.write(data);
// });

// const puppeteer = require("puppeteer-extra");
// const StealthPlugin = require("puppeteer-extra-plugin-stealth");

// puppeteer.use(StealthPlugin());
// // (async function startBrowser() {
// //   let browser;
// //   try {
// //     console.log("Opening the browser......");
// // browser = await puppeteer.launch({
// //   headless: false,
// //   args: ["--disable-setuid-sandbox"],
// //   ignoreHTTPSErrors: true,
// // });
// //   } catch (err) {
// //     console.log("Could not create a browser instance => : ", err);
// //   }
// //   return browser;
// // })();

// (async () => {
//   const browser = await puppeteer.launch({
//     headless: false,
//     args: ["--disable-setuid-sandbox"],
//     ignoreHTTPSErrors: true,
//   });
//   const page = await browser.newPage();
//   await page.setExtraHTTPHeaders({
//     "Accept-Language": "en",
//   });

//   await page.setUserAgent(
//     "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36"
//   );

//   await page.goto(
//     "https://www.allbiz.com/business/golden-touch-car-wash-inc-718-855-8400"
//   );

//   const notBot = "#checkbox";
//   const notBot2 = ".big-button pow-button";
//   // Type into search box.
//   await page.waitForSelector(notBot);
//   await page.waitForSelector(notBot2);
//   await page.click(notBot);
//   await page.click(notBot2);

//   // Wait for suggest overlay to appear and click "show all results".

//   if (notBot) {
//     await page.waitForSelector(notBot);
//     await page.click(notBot);
//   }

//   // await page.waitForSelector(allResultsSelector);
//   //await page.click(allResultsSelector);

//   // Wait for the results page to load and display the results.
//   const resultsSelector = ".detailed-header";
//   await page.waitForSelector(resultsSelector);

//   // Extract the results from the page.
//   // const links = await page.evaluate((resultsSelector) => {
//   //   return [...document.querySelectorAll(resultsSelector)].map((anchor) => {
//   //     const title = anchor.textContent.split("|")[0].trim();
//   //     return `${title} - ${anchor.href}`;
//   //   });
//   // }, resultsSelector);

//   // Print all the files.
//   console.log(links.join("\n"));
//   console.log(resultsSelector.textContent);

//   //await browser.close();
// })();

// puppeteer-extra is a drop-in replacement for puppeteer,
// it augments the installed puppeteer with plugin functionality.
// Any number of plugins can be added through `puppeteer.use()`
const puppeteer = require("puppeteer-extra");

// Add stealth plugin and use defaults (all tricks to hide puppeteer usage)
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

// Add adblocker plugin to block all ads and trackers (saves bandwidth)
const AdblockerPlugin = require("puppeteer-extra-plugin-adblocker");
puppeteer.use(AdblockerPlugin({ blockTrackers: true }));

const { executablePath } = require("puppeteer");
// That's it, the rest is puppeteer usage as normal 😊
puppeteer
  .launch({ headless: true, executablePath: executablePath() })
  .then(async (browser) => {
    const page = await browser.newPage();
    await page.setViewport({ width: 800, height: 600 });
    await page.setExtraHTTPHeaders({
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36 Edg/107.0.1418.62",
      "upgrade-insecure-requests": "1",
      accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3",
      "accept-encoding": "gzip, deflate, br",
      "accept-language": "en-US,en;q=0.9,en;q=0.8",
      "sec-ch-ua": "Microsoft Edge;v=107, Chromium;v=107, Not=A?Brand;v=24",
    });

    console.log(`Testing adblocker plugin..`);
    await page.goto(
      "https://www.allbiz.com/business/golden-touch-car-wash-inc-718-855-8400"
    );
    await page.waitForTimeout(5000);
    await page.screenshot({ path: "adblocker.png", fullPage: true });

    await page.waitForSelector(".detailed-header");

    const textContent = await page.evaluate(() => {
      return document.querySelector(".detailed-header").textContent;
    });

    console.log(textContent);

    console.log(`All done, check the screenshots. ✨`);
    await browser.close();
  });

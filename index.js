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

var puppeteer = require("puppeteer-extra");
var RecaptchaPlugin = require("puppeteer-extra-plugin-recaptcha");
var express = require("express");
cors = require("cors"); // Adding Express
var app = express();
app.use(express.json());
app.use(cors());

// Add stealth plugin and use defaults (all tricks to hide puppeteer usage)
var StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

// Add adblocker plugin to block all ads and trackers (saves bandwidth)
var AdblockerPlugin = require("puppeteer-extra-plugin-adblocker");
puppeteer.use(AdblockerPlugin({ blockTrackers: true }));

puppeteer.use(
  RecaptchaPlugin({
    provider: {
      id: "2captcha",
      token: "6LfAWO8SAAAAAODEVtjx0BNG21FguSE1RA-8NM6W",
    },
    visualFeedback: true, // colorize reCAPTCHAs (violet = detected, green = solved)
  })
);

var { executablePath } = require("puppeteer");
// That's it, the rest is puppeteer usage as normal 😊

app.get("/con", function (req, res) {
  console.log(req.query);
  puppeteer
    .launch({ headless: true, executablePath: executablePath() ,args: ['--no-sandbox','--disable-setuid-sandbox']})
    .then(async (browser) => {
      const page = await browser.newPage();
      await page.setViewport({ width: 800, height: 600 });

      console.log(`Testing adblocker plugin..`);
      await page.goto(
        'https://www.google.com/search?q=www.allbiz.com+"' +
          req.query.q +
          '"+primary+contact+for'
      );
      await page.solveRecaptchas();

      await page.waitForTimeout(5000);
      // await page.screenshot({ path: "adblocker.png", fullPage: true });
      let textContent = "";
      //await page.waitForSelector(".Z26q7c");
      if ((await page.$(".Z26q7c")) !== null) {
        textContent = await page.evaluate(() => {
          return document.querySelectorAll(".Z26q7c")[1].innerText;
        });
      } else {
        textContent = "No owner found";
      }

      // const textContent = await page.evaluate(() => {
      //   let el = document.querySelectorAll(".Z26q7c")[1].innerText;

      //   return el ? el.innerText : "Now owner found";
      // });

      console.log(`All done, check the screenshots. ✨`);
      await browser.close();

      res.json(textContent);
    });
});

app.get("/connect", function (req, res) {
  console.log(req.query);
  puppeteer
    .launch({ headless: true, executablePath: executablePath(),args: ['--no-sandbox','--disable-setuid-sandbox'] })
    .then(async (browser) => {
      const page = await browser.newPage();
      await page.setViewport({ width: 800, height: 600 });

      console.log(`Testing adblocker plugin..`);
      await page.goto(
        "https://www.google.com/search?q=" + req.query.q + " owner"
      );
      await page.solveRecaptchas();

      await page.waitForTimeout(5000);

      let textContent = "";
      //await page.waitForSelector(".Z26q7c");
      if ((await page.$("cite")) !== null) {
        textContent = await page.evaluate(() => {
          var search1 = document.querySelectorAll("cite")[0].innerText;
          var search2 = document.querySelectorAll("cite")[2].innerText;
          var search3 = document.querySelectorAll("cite")[4].innerText;

          if (
            search1 &&
            (search1.indexOf("www.buzzfile.com") !== -1 ||
              search1.indexOf("www.bbb.org") !== -1 ||
              search1.indexOf("www.allbiz.com") !== -1)
          ) {
            return document.querySelectorAll(".VwiC3b span")[0].innerText;
          } else if (
            search2 &&
            (search2.indexOf("www.buzzfile.com") !== -1 ||
              search2.indexOf("www.bbb.org") !== -1 ||
              search2.indexOf("www.allbiz.com") !== -1)
          ) {
            return document.querySelectorAll(".VwiC3b span")[1].innerText;
          } else if (
            search3 &&
            (search3.indexOf("www.buzzfile.com") !== -1 ||
              search3.indexOf("www.bbb.org") !== -1 ||
              search3.indexOf("www.allbiz.com") !== -1)
          ) {
            return document.querySelectorAll(".VwiC3b span")[2].innerText;
          } else {
            return "NO Owner found";
          }
        });
      } else {
        textContent = "No owner found";
      }

      // const textContent = await page.evaluate(() => {
      //   let el = document.querySelectorAll(".Z26q7c")[1].innerText;

      //   return el ? el.innerText : "Now owner found";
      // });

      console.log(`All done, check the screenshots. ✨`);
      await browser.close();

      res.json(textContent);
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("listening on 5000");
});

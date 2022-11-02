import puppeteer from "puppeteer";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

const defaultPageTimeout = 1500;

const delay = (t, v) => {
  new Promise((resolve) => setTimeout(resolve, t, v));
};

const wrapPhrase = (phrase) => `//text()[contains(.,'${phrase}')]`;

const start = async (url, holdingPageTextXQuery) => {
  console.log(
    `Starting... url:${url} holdingPageTextXQuery:${holdingPageTextXQuery}`
  );

  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  console.log(`Waiting for the browser to open...`);
  await delay(10000); // we wait for 10 seconds to let the browser open

  let attempt = 1;
  let shouldContinue = false;
  while (true) {
    shouldContinue = false;
    try {
      console.info(`starting attempt:${attempt}`);

      await page.goto(url, { timeout: defaultPageTimeout }).catch((e) => {
        console.error(`failed to load page ${e}`);
        shouldContinue = true;
      });
      //await page.waitForNetworkIdle({ timeout: 1500 }); //Possibly need to undo this on the day if we are going too fast

      if (shouldContinue) {
        console.info(`completed attempt:${attempt} `);
        ++attempt;
        continue;
      }

      const instancesOfHoldingPageText = await page.$x(holdingPageTextXQuery);

      if (instancesOfHoldingPageText.length > 0) {
        console.info(`completed attempt:${attempt} `);
        ++attempt;
        continue;
      }

      break;
    } catch (exception) {
      console.log(exception);
    }
  }

  console.log("We are in?");
  //we wait for a long time to allow the user to complete the registration
  await delay(100000000);
};
console.info('init');

await yargs(hideBin(process.argv))
  .usage("usage node $0 -url <url> -xpath <xpath> || -phrase <phrase>")
  .command(
    "$0",
    "fetch the contents of the URL",
    {
      url: {
        alias: "url",
        type: "string",
        description:
          "url to the holding page e.g. https://glastonbury.seetickets.com/event/glastonbury-2020-deposits/worthy-farm/1450000",
        demandOption: true,
      },
      xpath: {
        alias: "x",
        type: "string",
        description:
          "xpath to that should be present on the holding page \n supply this or phrase not both",
        conflicts: "phrase",
        demandOption: false,
      },
      phrase: {
        alias: "p",
        type: "string",
        description:
          "phase that should be present on the holding page \n supply this or xpath not both",
        conflicts: "xpath",
        demandOption: false,
      },
    },
    (async (argv) => {
      console.log("pre start");
      const { url, xpath, phrase } = argv;
      if(!xpath && !phrase){
        console.error("either xpath or phrase must be supplied");
        return;
      }
      await start(url, xpath || wrapPhrase(phrase));
    })
  )
  .help()
  .alias("help", "h").argv;

// const testMode = true;

// //const registrationPhrase = "Please enter your registration details"
// //const depositUrl = "https://glastonbury.seetickets.com/event/glastonbury-2020-deposits/worthy-farm/1450000"
// const depositUrl = testMode
//   ? "http://172.29.183.191:3000/"
//   : "https://glastonbury.seetickets.com/event/glastonbury-2020-deposits/worthy-farm/1450000";

// const holdingPageTextXQuery = testMode
//   ? "//text()[contains(.,'Number of hits')]"
//   : "//text()[contains(.,'lore ipsum')]";

console.info('exit');
import puppeteer from "puppeteer";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

const browserStartupDelay = 1200;
const defaultPageTimeout = 1200;

const delay = async (t, v) =>
  new Promise((resolve) => setTimeout(resolve, t, v));

const wrapPhrase = (phrase) => `//text()[contains(.,'${phrase}')]`;

const start = async (url, holdingPageTextXQuery) => {
  console.log(
    `Starting... url:${url} holdingPageTextXQuery:${holdingPageTextXQuery}`
  );

  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  console.log(`Waiting for the browser to open...`);
  await delay(browserStartupDelay); // we wait to let the browser open

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
        console.info(`completed attempt:${attempt}`);
        await delay(defaultPageTimeout);
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
      delay: {
        alias: "d",
        type: "number",
        description:
          "wait this amount of time between each reload to prevent getting rate limited",
        demandOption: false,
        default: defaultPageTimeout
      },
    },
    (async (argv) => {
      console.log("pre start");
      const { url, xpath, phrase } = argv;
      if (!xpath && !phrase) {
        console.error("either xpath or phrase must be supplied");
        return;
      }
      await start(url, xpath || wrapPhrase(phrase));
    })
  )
  .help()
  .alias("help", "h").argv;

console.info('exit');
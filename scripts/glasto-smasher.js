import puppeteer from "puppeteer";

const testMode = true;
const defaultPageTimeout = 1500;

//const registrationPhrase = "Please enter your registration details"
//const depositUrl = "https://glastonbury.seetickets.com/event/glastonbury-2020-deposits/worthy-farm/1450000"

const depositUrl = testMode
  ? "http://172.29.183.191:3000/"
  : "https://glastonbury.seetickets.com/event/glastonbury-2020-deposits/worthy-farm/1450000";

/*
Test with something like 

$x("//text()[contains(.,'Number of hits')]")

in the browser console
*/

//We take a phrase from the queue page
const holdingPageTextXQuery = testMode
  ? "//text()[contains(.,'Number of hits')]"
  : "//text()[contains(.,'lore ipsum')]";

const delay = (t, v) => {
  new Promise((resolve) => setTimeout(resolve, t, v));
};

(async () => {
  let attempt = 1;

  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await delay(10000); // we wait for 10 seconds to let the browser open

  let shouldContinue = false;
  while (true) {
    shouldContinue = false;
    try {
      console.info(`starting attempt:${attempt}`);

      await page.goto(depositUrl, { timeout: defaultPageTimeout }).catch((e) => {
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
})();

import puppeteer, { Overrides } from "puppeteer";

export function takeScreenshot(url: string): Promise<Buffer> {
  return new Promise(async (resolve, reject) => {
    try {
      const browser = await puppeteer.launch({ args: ["--no-sandbox"] });

      const page = await browser.newPage();

      console.log("cargamos la url");

      await page.goto(url, {
        waitUntil: "load"
      });

      console.log("sacamos la captura");

      const screenshot = await page.screenshot({ fullPage: true });

      await browser.close();

      resolve(screenshot);
    } catch (error) {
      console.log(error);
      console.log("\n\n\nError Puppeteer!!!!!");
      reject(error);
    }
  });
}

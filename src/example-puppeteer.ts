import puppeteer, { Overrides } from 'puppeteer';

export function takeScreenshot(url: string): Promise<Buffer> {
  return new Promise(async (resolve, reject) => {
    try {
      const browser = await puppeteer.launch({ args: ['--no-sandbox'] });

      const page = await browser.newPage();

      await page.goto(url, {
        waitUntil: 'load'
      });

      const screenshot = await page.screenshot({ fullPage: true });

      await browser.close();

      resolve(screenshot);
    } catch (error) {
      reject(error);
    }
  });
}

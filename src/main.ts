import express, { Request, Response } from 'express';
import BodyParser from 'body-parser';
import puppeteer from 'puppeteer';
import { stringify } from 'query-string';
import path from 'path';
import ejs from 'ejs';

const PORT = 4321;
const app = express();

app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));

app.get('/template', (req: Request, res: Response) =>
  res.redirect('/template/index.html')
);

app.get('/template/index.html', async (req: Request, res: Response) => {
  ejs.renderFile(
    path.resolve(__dirname, '../template/index.html'),
    req.body.data || {},
    {},
    (error, html) => {
      if (error) {
        res.send(error);
      } else {
        res.send(html);
      }
    }
  );
});

app.use('/template', express.static(path.resolve(__dirname, '../template')));

app.get('/banner', async (req: Request, res: Response) => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 675, deviceScaleFactor: 2 });
    await page.setRequestInterception(true);
    page.on('request', interceptedRequest => {
      interceptedRequest.continue({
        method: 'POST',
        postData: stringify(req.body.data || {})
      });
    });
    await page.goto(`http://localhost:${PORT}/template/index.html`, {
      waitUntil: 'networkidle0'
    });
    const screenshot = await page.screenshot({ fullPage: true });
    await browser.close();
    res.writeHead(200, { 'Content-Type': 'image/png' });
    res.end(screenshot, 'binary');
  } catch (e) {
    res.status(500).send(e);
  }
});

app.listen(PORT, () =>
  console.log(`[AlmeríaJS] Escuchando por el puerto ${PORT}`)
);

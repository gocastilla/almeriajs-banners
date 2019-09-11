import express, { Request, Response, NextFunction } from 'express';
import BodyParser from 'body-parser';
import cors from 'cors';
import puppeteer from 'puppeteer';
import path from 'path';
import ejs from 'ejs';

const PORT = 4444;
const app = express();
app.use(cors());
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));

// SERVE FORM

app.use('/', express.static(path.resolve(__dirname, '../form')));

// SERVE BANNER TEMPLATE

function renderTemplatoIndex(data: any): Promise<string | unknown> {
  return new Promise((resolve, reject) => {
    const index = path.resolve(__dirname, '../template/index.html');
    ejs.renderFile(index, data, {}, (error, html) => {
      if (error) {
        reject(error);
      } else {
        resolve(html);
      }
    });
  });
}

app.get('/template/index.html', async (req: Request, res: Response) =>
  renderTemplatoIndex(req.query.data ? JSON.parse(req.query.data) : {})
    .then(template => {
      res.send(template);
    })
    .catch(error => {
      res.status(500).send(error);
    })
);

app.use('/template', express.static(path.resolve(__dirname, '../template')));

// GENERATE BANNER IMAGE

function generateBanner(data = {}): Promise<Buffer> {
  return new Promise(async (resolve, reject) => {
    try {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.setViewport({
        width: 1200,
        height: 675,
        deviceScaleFactor: 2
      });
      const _data = encodeURI(JSON.stringify(data));
      await page.goto(
        `http://localhost:${PORT}/template/index.html?data=${_data}`,
        {
          waitUntil: 'networkidle0'
        }
      );
      const screenshot = await page.screenshot({ fullPage: true });
      await browser.close();
      resolve(screenshot);
    } catch (error) {
      reject(error);
    }
  });
}

app.get('/banner.png', async (req: Request, res: Response) =>
  generateBanner(req.query.data ? JSON.parse(req.query.data) : {})
    .then(image =>
      res.writeHead(200, { 'Content-Type': 'image/png' }).end(image, 'binary')
    )
    .catch(error => {
      console.log(error);
      res.status(500).send(error);
    })
);

app.get('/banner.json', async (req: Request, res: Response) =>
  generateBanner(req.query.data ? JSON.parse(req.query.data) : {})
    .then(image => {
      res.send({
        base64: `data:image/png;base64,${image.toString('base64')}`
      });
    })
    .catch(error => res.status(500).send(error))
);

// OK!

app.listen(PORT, () =>
  console.log(`[+] [AlmeríaJS - Banners] Escuchando por el puerto ${PORT}...`)
);

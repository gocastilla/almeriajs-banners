import express, { Request, Response } from 'express';
import BodyParser from 'body-parser';
import puppeteer from 'puppeteer';
import path from 'path';
import ejs from 'ejs';

const PORT = 4321;
const app = express();

app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));

app.get(
  ['/template', '/template/index.html'],
  async (req: Request, res: Response) => {
    const data = {
      date: 'Jueves, 19 de Septiembre de 2019',
      talks: [
        {
          title: 'Asdasdasd',
          avatar: 'https://i.imgur.com/Sm7xEPo.png',
          speaker: 'Alberto Gómez',
          twitter: '@gocastilla',
          rank: 'Front-end developer en Coderty'
        },
        {
          title: 'Asdasdasd',
          avatar: 'https://i.imgur.com/Sm7xEPo.png',
          speaker: 'José Manuel García Giménez',
          twitter: '@josefdsa',
          rank: 'Cloud Data engineer en Elastacloud'
        }
      ]
    };
    ejs.renderFile(
      path.resolve(__dirname, '../template/index.html'),
      data,
      {},
      (error, html) => {
        if (error) {
          res.send(error);
        } else {
          res.send(html);
        }
      }
    );
  }
);

app.use('/template', express.static(path.resolve(__dirname, '../template')));

app.get('/banner-png', async (req: Request, res: Response) => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 675 });
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

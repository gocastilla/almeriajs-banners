import express, {
  Request as Req,
  Response as Res,
  NextFunction as Next
} from "express";
import BodyParser from "body-parser";
import cors from "cors";
import path from "path";

import { takeScreenshot } from "./example-puppeteer";
import { renderTemplate } from "./example-ejs";

const PORT = 4444;

const app = express();
app.use(cors());
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));

app.use("/", express.static(path.resolve(__dirname, "../form")));

app.get("/template/index.html", (req: Req, res: Res) => {
  const data = req.query.data ? JSON.parse(req.query.data) : {};
  renderTemplate(path.resolve(__dirname, "../template/index.html"), data)
    .then(template => res.send(template))
    .catch(error => res.status(500).send(error));
});

app.use("/template", express.static(path.resolve(__dirname, "../template")));

app.post("/banner", (req: Req, res: Res) => {
  const data = encodeURI(JSON.stringify(req.body || {}));
  takeScreenshot(`http://localhost:${PORT}/template/index.html?data=${data}`)
    .then(image => res.contentType("image/png").send(image))
    .catch(error => res.status(500).send(error));
});

app.get("/banner", (req: Req, res: Res) => {
  const data = encodeURI(JSON.stringify(req.body || {}));
  console.log("takeScreenshot()");
  takeScreenshot(`http://localhost:${PORT}/template/index.html?data=${data}`)
    .then(image => res.contentType("image/png").send(image))
    .catch(error => res.status(500).send(error));
});

app.listen(PORT, () =>
  console.log(`[+] [AlmeríaJS] https://localhost:${PORT}/`)
);

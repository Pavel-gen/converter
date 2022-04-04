import express from "express";
import fs from "fs";
import axios from "axios";
import { upload } from "./middleWare/loader.js";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";

dotenv.config();
console.log();

const __dirname = path.resolve();

const app = express();
app.use(express.static(__dirname + "/uploads"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
const PORT = 5000;

app.post("/", upload.single("img"), async (req, res) => {
  try {
    console.log(req.file);
    let fileName = req.file.path;
    let needed_index = fileName.indexOf(".");
    let text_name = fileName.slice(0, needed_index);
    const file = fs.readFileSync(`./${fileName}`);
    const encoded = Buffer.from(file).toString("base64");

    console.log(process.env.OAUTH);
    console.log(process.env.CLOUD_ID);

    const body = {
      folderId: process.env.CLOUD_ID,
      analyze_specs: [
        {
          content: encoded,
          features: [
            {
              type: "TEXT_DETECTION",
              text_detection_config: {
                language_codes: ["*"],
              },
            },
          ],
        },
      ],
    };

    let token = await axios.post(
      "https://iam.api.cloud.yandex.net/iam/v1/tokens",
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        yandexPassportOauthToken: process.env.OAUTH,
      }
    );

    let IAM_TOKEN = token.data["iamToken"];

    const url = " https://vision.api.cloud.yandex.net/vision/v1/batchAnalyze";

    const answer = await axios.post(url, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${IAM_TOKEN}`,
      },
    });
    let start_arr =
      answer.data["results"][0]["results"][0]["textDetection"]["pages"][0][
        "blocks"
      ];

    let text = [];
    start_arr.map((item) => {
      item["lines"].map((thing) => {
        let line = thing["words"];
        let new_l = "";
        line.map((w) => {
          new_l = new_l + " " + w["text"];
        });
        console.log(new_l);
        text.push(new_l);
        return new_l;
      });
    });
    console.log(text);
    let f_text = text.reduce((prev, next) => prev + "\n" + next, "");
    console.log(f_text);
    fs.writeFileSync(`./${text_name}.txt`, f_text);

    res.json("nice");
  } catch (err) {
    console.log(err.message);
    res.json({ message: err.message });
  }
});

app.get("/", async (req, res) => {});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

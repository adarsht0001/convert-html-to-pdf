import puppeteer from "puppeteer";
import handlebars from "handlebars";
import fs from "fs";
import { join } from "path";

(async function () {
  const templateHtml = fs.readFileSync(
    join(process.cwd(), "invoice.html"),
    "utf8"
  );

  const options = {
    format: "A4",
    margin: {
      top: "40px",
      bottom: "40px",
    },
    path: "invoice.pdf",
  };

  const dataBinding = {
    name: "test user",
    address: "test address",
    email: "tets@gmail.com",
    items: [
      {
        name: "product 1",
        price: 23,
      },
      {
        name: "product 2",
        price: 143,
      },
      {
        name: "product 3",
        price: 143,
      },
    ],
    total: 789,
  };

  const template = handlebars.compile(templateHtml);
  const finalHtml = encodeURIComponent(template(dataBinding));

  const browser = await puppeteer.launch({
    args: ["--no-sandbox"],
    headless: true,
  });
  const page = await browser.newPage();
  await page.goto(`data:text/html;charset=UTF-8,${finalHtml}`, {
    waitUntil: "networkidle0",
  });

  let pdfBuffer = await page.pdf(options);
  await browser.close();
  console.log("pdf saved");
})();

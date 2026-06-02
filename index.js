const express = require("express");
const app = express();

const PIXIV_URLS = [
  "https://i.pixiv.re/img-original/img/2026/06/01/23/00/01/145495505_p0.jpg",
  "https://i.pixiv.re/img-original/img/2025/08/20/00/00/07/144537773_p0.jpg",
  "https://i.pixiv.re/img-original/img/2026/05/31/22/05/24/145450955_p0.jpg",
  "https://i.pixiv.re/img-original/img/2026/05/28/00/15/43/144149869_p0.jpg"
];

app.get("/", (req, res) => {
  const randomUrl = PIXIV_URLS[Math.floor(Math.random() * PIXIV_URLS.length)];
  res.redirect(randomUrl);
});

module.exports = app;

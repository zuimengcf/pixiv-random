const express = require("express");
const app = express();

app.get("/", (req, res) => {
  // 随机 ID (0-1000)
  const id = Math.floor(Math.random() * 1000);
  const w = req.query.w || 800;
  const h = req.query.h || 600;
  res.redirect(`https://picsum.photos/id/${id}/${w}/${h}`);
});

module.exports = app;

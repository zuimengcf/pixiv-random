const express = require("express");
const axios = require("axios");
const app = express();

app.get("/", async (req, res) => {
  try {
    // Yande.re 随机获取一张图片
    const r = await axios.get("https://yande.re/post.json?limit=1&tags=rating:safe order:random", {timeout: 10000});
    if (r.data && r.data[0]) {
      // 使用高质量预览图 (约 850px)
      const imgUrl = r.data[0].sample_url;
      res.redirect(imgUrl);
    } else {
      res.status(404).send("No image found");
    }
  } catch (e) {
    res.status(500).send("Error: " + e.message);
  }
});

module.exports = app;

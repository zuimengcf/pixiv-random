const express = require("express");
const axios = require("axios");
const app = express();

// 随机图片接口 - 返回域名+图片地址
app.get("/", async (req, res) => {
  try {
    const r = await axios.get("https://yande.re/post.json?limit=1&tags=rating:safe order:random", {timeout: 10000});
    if (r.data && r.data[0]) {
      const imgUrl = r.data[0].file_url;
      const base = req.headers.origin || `https://${req.hostname}`;
      const encoded = Buffer.from(imgUrl).toString("base64");
      res.json({
        url: imgUrl,
        proxy: `${base}/i/${encoded}`
      });
    } else {
      res.status(404).json({error: "No image found"});
    }
  } catch (e) {
    res.status(500).json({error: e.message});
  }
});

// 代理接口 - 通过base64编码的图片URL访问
app.get("/i/:encoded", async (req, res) => {
  try {
    const imgUrl = Buffer.from(req.params.encoded, "base64").toString("utf-8");
    const r = await axios.get(imgUrl, {responseType: "stream", timeout: 30000});
    res.set("Content-Type", r.headers["content-type"] || "image/jpeg");
    r.data.pipe(res);
  } catch (e) {
    res.status(500).send("Error: " + e.message);
  }
});

module.exports = app;

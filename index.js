const express = require("express");
const axios = require("axios");
const app = express();

const getImage = async () => {
  const r = await axios.get("https://yande.re/post.json?limit=1&tags=rating:safe order:random", {timeout: 10000});
  if (!r.data || !r.data[0]) throw new Error("No image");
  const imgUrl = r.data[0].file_url;
  const base = `https://${process.env.VERCEL_URL}`;
  const encoded = Buffer.from(imgUrl).toString("base64url");
  return {
    url: imgUrl,
    proxy: `${base}/i/${encoded}`
  };
};

// JSON 返回图片信息
app.get("/", async (req, res) => {
  try {
    const img = await getImage();
    res.json(img);
  } catch (e) {
    res.status(500).json({error: e.message});
  }
});

// 直接显示图片
app.get("/img", async (req, res) => {
  try {
    const img = await getImage();
    res.redirect(img.proxy);
  } catch (e) {
    res.status(500).send("Error: " + e.message);
  }
});

// 代理图片
app.get("/i/:encoded", async (req, res) => {
  try {
    const imgUrl = Buffer.from(req.params.encoded, "base64url").toString("utf-8");
    const r = await axios.get(imgUrl, {responseType: "stream", timeout: 30000});
    res.set("Content-Type", r.headers["content-type"] || "image/jpeg");
    res.set("Cache-Control", "public, max-age=86400");
    r.data.pipe(res);
  } catch (e) {
    res.status(500).send("Error: " + e.message);
  }
});

module.exports = app;

const express = require("express");
const axios = require("axios");
const app = express();

const getImage = async () => {
  const r = await axios.get("https://yande.re/post.json?limit=1&tags=rating:safe order:random", {timeout: 10000});
  if (!r.data || !r.data[0]) throw new Error("No image");
  const imgUrl = r.data[0].file_url;
  const base = `https://${process.env.VERCEL_URL}`;
  const encoded = Buffer.from(imgUrl).toString("base64url");
  return {url: imgUrl, proxy: `${base}/i/${encoded}`};
};

// 文档页面
app.get("/", (req, res) => {
  res.send(`<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Random Image API</title>
<style>
  body{font-family:system-ui;max-width:800px;margin:50px auto;padding:20px;background:#fafafa}
  h1{color:#333}
  .endpoint{background:#fff;padding:15px;margin:10px 0;border-radius:8px;box-shadow:0 2px 4px rgba(0,0,0,0.1)}
  .method{background:#4CAF50;color:#fff;padding:3px 8px;border-radius:4px;font-size:12px}
  code{background:#eee;padding:2px 6px;border-radius:4px}
  pre{background:#2d2d2d;color:#f8f8f2;padding:15px;border-radius:8px;overflow-x:auto}
  .tag{color:#ff6b6b}
</style></head>
<body>
  <h1>🎨 Random Image API</h1>
  <p>随机返回一张动漫高清图片 <span class="tag">(Yande.re)</span></p>
  <div class="endpoint"><span class="method">GET</span> <code>/</code> - 首页文档</div>
  <div class="endpoint"><span class="method">GET</span> <code>/json</code> - JSON返回<pre>{"url":"原图地址","proxy":"代理地址"}</pre></div>
  <div class="endpoint"><span class="method">GET</span> <code>/img</code> - 直接显示图片</div>
  <div class="endpoint"><span class="method">GET</span> <code>/i/{base64url}</code> - 代理访问图片</div>
</body></html>`);
});

// JSON 返回
app.get("/json", async (req, res) => {
  try { res.json(await getImage()); }
  catch (e) { res.status(500).json({error: e.message}); }
});

// 重定向到图片
app.get("/img", async (req, res) => {
  try { res.redirect((await getImage()).proxy); }
  catch (e) { res.status(500).send("Error: " + e.message); }
});

// 代理图片
app.get("/i/:encoded", async (req, res) => {
  try {
    const imgUrl = Buffer.from(req.params.encoded, "base64url").toString("utf-8");
    const r = await axios.get(imgUrl, {responseType: "stream", timeout: 30000});
    res.set("Content-Type", r.headers["content-type"] || "image/jpeg");
    res.set("Cache-Control", "public, max-age=86400");
    r.data.pipe(res);
  } catch (e) { res.status(500).send("Error: " + e.message); }
});

module.exports = app;
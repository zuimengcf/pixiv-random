const express = require("express");
const axios = require("axios");
const app = express();

app.get("/", async (req, res) => {
  try {
    const r = await axios.get("https://dog.ceo/api/breeds/image/random");
    res.redirect(r.data.message);
  } catch {
    res.redirect("https://images.dog.ceo/breeds/greyhound-indian/rampur-greyhound.jpg");
  }
});

module.exports = app;

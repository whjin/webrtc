const express = require("express");
const router = express.Router();
const path = require("path");
const https = require("https");
const axios = require("axios");

router.get("/", (req, res) => {
  res.send(`<h1>欢迎进入服务页</h1>`);
});
router.get("/control", (req, res) => {
  res.sendFile(path.join(__dirname, "../html/control.html"));
});
router.get("/terminal", (req, res) => {
  res.sendFile(path.join(__dirname, "../html/terminal.html"));
});
router.get("/http", (req, res) => {
  res.sendFile(path.join(__dirname, "../html/http.html"));
});

router.get("/http/systemInitSetting", async (req, res) => {
  try {
    console.log('req===>', req.params);
    const agent = new https.Agent({
      rejectUnauthorized: false
    });
    const instance = axios.create({
      httpsAgent: agent
    });
    const response = await instance.get("https://192.168.20.214:82/terminal/terSetting/systemInitSetting");
    const data = response.data;
    res.json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(5000).send("Server error");
  }
});

module.exports = router;
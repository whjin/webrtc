const express = require("express");
const app = express();
const https = require("https");
const socket = require("socket.io");
const axios = require("axios");
const { readFileSync } = require("fs");
const router = require("./public/router");

const { JSDOM } = require("jsdom");
const { document } = new JSDOM("<!doctype html><html><body></body></html>").window;
global.document = document;

let clients = [];
const globalVar = require("./public/js/globalVar");
const HOST = process.env.HOST || globalVar.HOST;
const PORT = process.env.PORT || globalVar.PORT;

const options = {
  cert: readFileSync("./public/certificate/pems/cert.pem"),
  key: readFileSync("./public/certificate/pems/key.pem"),
};
const server = https.Server(options, app);
const io = socket(server, { cors: { origin: "*" } });

app.use(express.static("public"));
app.use("/css", express.static(__dirname + "/public/css"));
app.use("/js", express.static(__dirname + "/public/js"));
app.use("/assets", express.static(__dirname + "/public/assets"));
app.use("/html", express.static(__dirname + "/public/html"));

app.use(router);

io.on("connection", (socket) => {
  const {
    query: { code },
  } = socket.handshake;

  clients.push(code);
  clients = Array.from(new Set(clients));
  console.log(clients);
  console.log("---------------- 分割线 ---------------------");
  clients.length && clients.map(code => {
    socket.join(code);
  });

  socket.on("sendData", data => {
    console.log(data);
    console.log("============== 分割线 =================");
  });

  socket.on("control_offer", (data) => {
    io.to(data.code).emit("control_offer", data.offer);
  });

  socket.on("control_answer", (data) => {
    io.to(data.code).emit("control_answer", data.answer);
  });

  socket.on("onicecandidate", (data) => {
    io.to(data.code).emit("onicecandidate", data.candidate);
  });

  socket.on("hangup", (code) => {
    socket.leave(code);
    clients = clients.filter(client => client != code);
    console.log("hangup", code, clients);
    console.log("+++++++++++++++++ 分割线 +++++++++++++++++++");
  });
});

server.listen(PORT, () => {
  console.log(`Server is running at https://${HOST}:${PORT}`);
});
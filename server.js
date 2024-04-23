const express = require("express");
const app = express();

const { JSDOM } = require("jsdom");
const { document } = new JSDOM("<!doctype html><html><body></body></html>").window;
global.document = document;

let clients = [];
const globalVar = require("./public/js/globalVar");

const HOST = process.env.HOST || globalVar.HOST;
const PORT = process.env.PORT || globalVar.PORT;

const http = require("http").Server(app);
const io = require("socket.io")(http, { cors: { origin: "*" } });

app.use("/js", express.static(__dirname + "/public/js"));

io.on("connection", (socket) => {
  socket.on("join", code => {
    clients.push(code);
    clients = clients.filter(item => !!item);
    clients = Array.from(new Set(clients));
    console.log(clients);
    console.log("---------------- 分割线 ---------------------");
    clients.length && clients.map(room => {
      socket.join(room);
    });
  });

  socket.on("offer", (offer, room, type) => {
    socket.join(room);
    socket.to(room).emit("offer", offer, type);
  });

  socket.on("answer", (answer, room) => {
    socket.join(room);
    socket.to(room).emit("answer", answer);
  });

  socket.on("icecandidate", (candidate, room) => {
    socket.join(room);
    socket.to(room).emit("icecandidate", candidate);
  });

  socket.on("hangup", (room) => {
    io.to(room).emit("hangup");
  });
});

http.listen(PORT, () => {
  console.log(`Server is running at http://${HOST}:${PORT}`);
});

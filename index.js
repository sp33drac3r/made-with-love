const build = require("./build");
const path = require("path");
build();

const express = require("express");

const livereload = require("livereload");

var liveReloadServer = livereload.createServer();
liveReloadServer.watch(path.join(__dirname, "build/light"));

var connectLivereload = require("connect-livereload");

var app = express();

app.use(connectLivereload());
app.use(express.static("build/light"));
app.listen(8085);

liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});

console.log("hello, world");

const build = require("./build");
build();

const express = require("express");
const app = express();

app.use(express.static("build/light"));
app.listen(8085);

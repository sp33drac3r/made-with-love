const build = require("./build");
build();

const express = require("express");
const app = express();
const open = require("open");

app.use(express.static("build/light"));
app.listen(8085);

open("http://localhost:8085");

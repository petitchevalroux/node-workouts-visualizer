"use strict";
var path = require("path");
var di = require(path.join(__dirname, "..", "di"));
var es = require("elasticsearch");
module.exports = new es.Client(di.config.get("elasticsearch"));

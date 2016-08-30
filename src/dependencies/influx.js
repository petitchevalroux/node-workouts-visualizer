"use strict";
var path = require("path");
var di = require(path.join(__dirname, "..", "di"));
var influx = require("influx");
module.exports = influx(di.config.get("influxdb"));

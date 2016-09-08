"use strict";
var path = require("path");
var Storage = require(path.join(__dirname, "..", "storages", "influxdb"));
module.exports = new Storage();

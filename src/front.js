"use strict";
var path = require("path");
var di = require(path.join(__dirname, "di"));
di.express.listen(di.config.get("express")
    .port);

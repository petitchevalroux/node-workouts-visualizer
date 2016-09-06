"use strict";
var path = require("path"),
    express = require("express");
var di = require(path.join(__dirname, "..", "di"));
var app = express();
app.use(function(req, res, next) {
    di.log.info({
        "request": {
            "method": req.method,
            "url": req.url
        }
    });
    next();
});

var staticOptions = {
    "root": path.join(__dirname, "..", "..", "public"),
    "dotfiles": "deny"
};

app.use(function(req, res, next) {
    res.sendFile(req.url, staticOptions, function(err) {
        if (err) {
            next(new di.Error(new di.Error.Http(404), err));
            return;
        }
    });
});

module.exports = app;

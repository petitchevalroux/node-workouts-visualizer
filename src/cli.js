"use strict";
var path = require("path");
var di = require(path.join(__dirname, "di"));

var nconf = require("nconf");
nconf.argv();
nconf.required(["user", "password", "storage"]);

// Ovewrite log level
var logLevel = nconf.get("log-level");
if (logLevel) {
    di.log.level = logLevel;
}

var Storage = require(path.join(__dirname, "storages", nconf.get("storage")));


var WorkoutsStream = require("@petitchevalroux/sports-tracker-client")
    .WorkoutsStream;

var wStream = new WorkoutsStream({
    "user": nconf.get("user"),
    "password": nconf.get("password")
});

var Transform = require("@petitchevalroux/workouts-standardizer")
    .SportsTrackerStream;
var tStream = new Transform();

var storage = new Storage();

var outStream = new require("@petitchevalroux/node-parallel-write-stream")({
    "concurrency": 4,
    "objectMode": true,
    "write": function(data, encoding, callback) {
        storage.write(data)
            .then(function() {
                di.log.info("writed data:", data);
                callback();
                return data;
            })
            .catch(function(err) {
                callback(err);
            });
    }
});

outStream.on("error", function(error) {
    di.log.error(error);
});

wStream.on("error", function(error) {
    di.log.error(error);
});
storage.setup()
    .then(function() {
        wStream.pipe(tStream)
            .pipe(outStream);
        return true;
    })
    .catch(function(err) {
        di.log.error(err);
    });

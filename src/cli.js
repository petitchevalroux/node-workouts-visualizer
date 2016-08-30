"use strict";

var path = require("path");
var nconf = require("nconf");
var Storage = require(path.join(__dirname, "storages", "elasticsearch"));
var process = require("process");

var WorkoutsStream = require("@petitchevalroux/sports-tracker-client")
    .WorkoutsStream;
nconf.argv();
nconf.required(["user", "password"]);

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
                process.stdout.write("Writed: " + JSON.stringify(
                    data) + "\n");
                callback();
                return data;
            })
            .catch(function(err) {
                callback(err);
            });
    }
});

outStream.on("error", function(error) {
    process.stderr.write("Error: " + error + "\n");
});

wStream.on("error", function(error) {
    process.stderr.write("Error: " + error + "\n");
});

wStream.pipe(tStream)
    .pipe(outStream);

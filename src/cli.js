"use strict";

var nconf = require("nconf");
nconf.argv();
nconf.required(["user", "password", "storage"]);

var path = require("path");

var Storage = require(path.join(__dirname, "storages", nconf.get("storage")));
var process = require("process");

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
storage.setup()
    .then(function() {
        wStream.pipe(tStream)
            .pipe(outStream);
        return true;
    })
    .catch(function(err) {
        process.stderr.write("Error: " + err + "\n");
    });

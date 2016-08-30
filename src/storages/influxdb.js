"use strict";
var path = require("path");
var di = require(path.join(__dirname, "..", "di"));
var Promise = require("bluebird");

function Storage() {

}

Storage.prototype.databaseExists = function() {
    return new Promise(function(resolve, reject) {
        di.influx.getDatabaseNames(function(err, databases) {
            if (err) {
                reject(err);
            }
            resolve(databases.indexOf("workouts") !== -1);
        });
    });
};

Storage.prototype.dropDatabase = function() {
    return new Promise(function(resolve, reject) {
        di.influx.dropDatabase("workouts", function(err) {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};

Storage.prototype.createDatabase = function() {
    return new Promise(function(resolve, reject) {
        di.influx.createDatabase("workouts", function(err) {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};

Storage.prototype.setup = function() {
    var self = this;
    return new Promise(function(resolve, reject) {
        if (self.setupError === false) {
            resolve(true);
            return;
        } else if (typeof self.setupError !== "undefined") {
            reject(self.setupError);
            return;
        }
        self.databaseExists()
            .then(function(exist) {
                if (exist) {
                    return self.dropDatabase();
                }
                return false;
            })
            .then(function() {
                return self.createDatabase();
            })
            .then(function() {
                self.setupError = false;
                resolve(true);
                return true;
            })
            .catch(function(err) {
                self.setupError = err;
                reject(err);
            });
    });

};

Storage.prototype.writePoint = function(data) {
    return new Promise(function(resolve, reject) {
        var values = {};
        var tags = {};
        Object.getOwnPropertyNames(data)
            .forEach(function(property) {
                if (property === "start") {
                    values["time"] = data[property];
                } else if (typeof data[property] === "number") {
                    values[property] = data[property];
                } else {
                    tags[property] = data[property];
                }
            });
        di.influx.writePoint("workouts", values, tags, {
            precision: "s",
            "db": "workouts"
        }, function(err) {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
};

Storage.prototype.write = function(data) {
    var self = this;
    return this.setup()
        .then(function() {
            return self.writePoint(data);
        });
};


module.exports = Storage;

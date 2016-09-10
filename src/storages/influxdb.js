"use strict";
var path = require("path");
var di = require(path.join(__dirname, "..", "di"));
var Promise = require("bluebird");

function Storage() {

}

Storage.prototype.databaseExists = function() {
    return new Promise(function(resolve, reject) {
        di.log.debug("fetching databases");
        di.influx.getDatabaseNames(function(err, databases) {
            if (err) {
                reject(new di.Error(
                    "unable to get databases", err));
                return;
            }
            di.log.debug("existing databases", databases);
            resolve(databases.indexOf("workouts") !== -1);
        });
    });
};

Storage.prototype.dropDatabase = function() {
    return new Promise(function(resolve, reject) {
        di.log.debug("dropping database");
        di.influx.setRequestTimeout(null);
        di.influx.dropDatabase("workouts", function(err) {
            var timeout = null;
            try {
                timeout = di.config.get("influxdb")
                    .requestTimeout;
                di.influx.setRequestTimeout(timeout);
                di.log.debug("timeout restored to %d",
                    timeout);
            } catch (err) {
                di.log.debug("unable to restore timeout",
                    err);
            }
            if (err) {
                reject(new di.Error(
                    "unable to drop database", err));
            } else {
                resolve();
            }
        });
    });
};

Storage.prototype.createDatabase = function() {
    return new Promise(function(resolve, reject) {
        di.log.debug("creating database");
        di.influx.createDatabase("workouts", function(err) {
            if (err) {
                reject(new di.Error(
                    "unable to create database",
                    err));
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
        di.log.debug("writing point", values, tags);
        di.influx.writePoint("workouts", values, tags, {
            precision: "s",
            "db": "workouts"
        }, function(err) {
            if (err) {
                reject(new di.Error("unable to write point",
                    err));
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

Storage.prototype.getTimeSeries = function(aggregateFunction, measure, period,
    from, to) {
    return new Promise(function(resolve, reject) {
        var offset = "";
        if (period === "w") {
            offset = ", 4d";
            period = "1w";
        } else if (period === "M") {
            period = "30d";
        } else if (period === "y") {
            period = "365d";
        } else if (period === "d") {
            period = "1d";
        }
        if (aggregateFunction === "avg") {
            aggregateFunction = "mean";
        }
        var stat = aggregateFunction + "(\"" + measure + "\")";
        var query = "SELECT " + stat +
            " as v, moving_average(" + stat +
            ", 5) as avg FROM workouts WHERE time >= '" + from +
            "'" +
            " AND time <= '" + to + "'" +
            " GROUP BY time(" + period + offset + ") fill(0)";
        di.log.debug("query", query);
        di.influx.query("workouts", query, function(err, data) {
            if (err) {
                reject(new di.Error(
                    "unable to get timeseries",
                    err));
            } else {
                resolve(data[0]);
            }
        });
    });
};


module.exports = Storage;

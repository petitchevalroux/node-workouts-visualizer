"use strict";
var Promise = require("bluebird");
var path = require("path");
var di = require(path.join(__dirname, "..", "..", "di"));
module.exports = function() {
    this.measures = {
        "duration": "sum",
        "distance": "sum",
        "avgHeartRate": "avg",
        "energy": "sum",
        "maxSpeed": "avg",
        "avgSpeed": "avg"
    };

    this.periods = {
        "d": true,
        "w": true,
        "M": true,
        "y": true
    };


    this.isValidMeasure = function(measure) {
        var self = this;
        return new Promise(function(resolve) {
            resolve(typeof self.measures[measure] !==
                "undefined");
        });
    };

    this.isValidPeriod = function(period) {
        var self = this;
        return new Promise(function(resolve) {
            resolve(self.periods[period] === true);
        });
    };

    this.isValidDate = function(date) {
        return new Promise(function(resolve) {
            var moment = require("moment");
            resolve(moment(date)
                .isValid());
        });
    };

    this.time = function(req, res, next) {
        var self = this;
        this.isValidMeasure(req.params.measure)
            .then(function(valid) {
                if (!valid) {
                    throw new di.Error.Http(404);
                }
                return req.params.measure;
            })
            .then(function() {
                return self.isValidPeriod(req.params.period);
            })
            .then(function(valid) {
                if (!valid) {
                    throw new di.Error.Http(404);
                }
                return req.params.period;
            })
            .then(function() {
                return self.isValidDate(req.query.from);
            })
            .then(function(valid) {
                if (!valid) {
                    throw new di.Error.Http(404);
                }
                return req.params.from;
            })
            .then(function() {
                return self.isValidDate(req.query.to);
            })
            .then(function(valid) {
                if (!valid) {
                    throw new di.Error.Http(404);
                }
                return req.params.to;
            })
            .then(function() {
                return di.statsStorage.getTimeSeries(
                    self.measures[req.params.measure],
                    req.params.measure,
                    req.params.period,
                    req.query.from,
                    req.query.to
                );
            })
            .then(function(timeSeries) {
                return res.send(timeSeries);
            })
            .catch(function(err) {
                next(err);
            });
    };
};

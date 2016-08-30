"use strict";
var path = require("path");
var di = require(path.join(__dirname, "..", "di"));
var Promise = require("bluebird");

function Storage() {

}

Storage.prototype.setup = function() {
    var self = this;
    return new Promise(function(resolve, reject) {
        if (self.setupError === false) {
            resolve(true);
        } else if (typeof self.setupError !== "undefined") {
            reject(self.setupError);
        }
        di.es.indices
            .exists({
                "index": "workouts"
            })
            .then(function(exist) {
                return exist || di.es.indices
                    .delete({
                        "index": "workouts"
                    })
                    .then(function() {
                        return di.es.indices.create({
                            "index": "workouts",
                            "body": {
                                "mappings": {
                                    "workout": {
                                        "properties": {
                                            "activity": {
                                                "type": "string",
                                                "index": "not_analyzed"
                                            },
                                            "start": {
                                                "type": "date",
                                                "format": "epoch_second"
                                            },
                                            "duration": {
                                                "type": "double"
                                            },
                                            "distance": {
                                                "type": "double"
                                            },
                                            "avgHeartRate": {
                                                "type": "double"
                                            },
                                            "energy": {
                                                "type": "double"
                                            }
                                        }
                                    }
                                }
                            }
                        });
                    });
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

Storage.prototype.write = function(data) {
    return this.setup()
        .then(function() {
            return di.es.index({
                "index": "workouts",
                "type": "workout",
                "body": data
            });
        });
};


module.exports = Storage;

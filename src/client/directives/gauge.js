"use strict";

module.exports = function($timeout, $http) {
    return {
        "link": function($scope) {
            var Promise = require("bluebird");
            var moment = require("moment");
            var c3 = require("c3");
            var humanizeDuration = require("humanize-duration");
            var fetchGauge = function(measure, from, to) {
                return $http.get("/data/gauge/" +
                    encodeURIComponent($scope.measure) +
                    "?from=" + encodeURIComponent(from.format()) +
                    "&to=" + encodeURIComponent(to.format()));
            };
            var week = 0;
            var weeksAverage = 0;
            var yearAverage = 0;
            var lastWeek = 0;
            // Array of promises
            var promises = [];
            // Add timeout promise as we can't draw graph without dom is ok
            promises.push($timeout);
            // Fetch current's week value (since last monday)
            promises.push(fetchGauge($scope.measure, moment()
                    .utc()
                    .startOf("isoWeek"), moment()
                    .utc())
                .then(function(response) {
                    week = response.data.v;
                    $scope.week = humanizeDuration(Math.round(
                        week / 60) * 60 * 1000);
                    return week;
                }));
            // Fetch last week value
            promises.push(fetchGauge($scope.measure, moment()
                    .utc()
                    .startOf("isoWeek")
                    .subtract(1, "w"),
                    moment()
                    .utc()
                    .startOf("isoWeek")
                    .subtract(1, "s"))
                .then(function(response) {
                    lastWeek = response.data.v;
                    $scope.lastWeek = humanizeDuration(Math.round(
                        lastWeek / 60) * 60 * 1000);
                    return $scope.lastWeek;
                }));
            // Fetch 5 last weeks since last monday value
            promises.push(fetchGauge($scope.measure, moment()
                    .utc()
                    .startOf("isoWeek")
                    .subtract(5, "w"),
                    moment()
                    .utc()
                    .startOf("isoWeek")
                    .subtract(1, "s"))
                .then(function(response) {
                    var weeksCount = moment()
                        .utc()
                        .startOf("isoWeek")
                        .diff(moment()
                            .utc()
                            .startOf("isoWeek")
                            .subtract(5, "w"), "weeks");
                    weeksAverage = response.data.v;
                    if (weeksCount) {
                        weeksAverage = weeksAverage /
                            weeksCount;
                    }
                    $scope.weeksAverage = humanizeDuration(Math
                        .round(weeksAverage / 60) * 60 *
                        1000);
                    return weeksAverage;
                }));
            // Fetch last year since last monday value
            promises.push(fetchGauge($scope.measure, moment()
                    .utc()
                    .startOf("isoWeek")
                    .subtract(1, "y"),
                    moment()
                    .utc()
                    .startOf("isoWeek")
                    .subtract(1, "s"))
                .then(function(response) {
                    var weeksCount = moment()
                        .utc()
                        .startOf("isoWeek")
                        .diff(moment()
                            .utc()
                            .startOf("isoWeek")
                            .subtract(1, "y"), "weeks");
                    yearAverage = response.data.v;
                    if (weeksCount) {
                        yearAverage = yearAverage / weeksCount;
                    }
                    $scope.yearAverage = humanizeDuration(Math.round(
                        yearAverage / 60) * 60 * 1000);
                    return yearAverage;
                }));
            // When everything is ok, draw the graph
            Promise.all(promises)
                .then(function() {
                    var max = Math.max(week, weeksAverage,
                        yearAverage);
                    var thresholds = [];
                    thresholds.push(weeksAverage / max * 100);
                    thresholds.push(yearAverage / max * 100);
                    thresholds.push(lastWeek / max * 100);
                    thresholds = thresholds.sort();
                    return c3.generate({
                        bindto: "#myGauge" + $scope.$id,
                        data: {
                            columns: [
                                ["data", week / max *
                                    100
                                ]
                            ],
                            type: "gauge"
                        },
                        gauge: {},
                        color: {
                            pattern: ["#FF0000", "#F97600",
                                "#F6C600",
                                "#60B044"
                            ],
                            threshold: {
                                values: thresholds
                            }
                        }
                    });
                })
                .catch(function(err) {
                    throw err;
                });

        },
        "restrict": "A",
        "templateUrl": "/assets/templates/directives/gauge.html",
        "scope": {
            "legend": "@legend",
            "measure": "@measure"
        }
    };
};

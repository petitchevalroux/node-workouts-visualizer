"use strict";
module.exports = function($scope, $http) {
    require("c3/c3.css");
    var c3 = require("c3");
    var d3 = require("d3");
    var moment = require("moment");
    var DateSelector = function() {
        this.value = new Date();
        this.opened = false;
        var self = this;
        this.open = function() {
            self.opened = true;
        };
    };
    $scope.dateFrom = new DateSelector();
    $scope.dateFrom.value = moment()
        .startOf("isoWeek")
        .subtract(1, "years")
        .startOf("isoWeek")
        .toDate();
    $scope.dateTo = new DateSelector();
    $scope.dateTo.value = moment()
        .startOf("isoWeek")
        .subtract(1, "seconds")
        .toDate();
    $scope.dateFormat = "yyyy-MM-dd";
    $scope.dateOptions = {
        formatYear: "yyyy",
        maxDate: new Date(),
        startingDay: 1
    };
    $scope.measures = {
        "duration": "Duration",
        "distance": "Distance",
        "avgHeartRate": "Heart rate",
        "energy": "Energy",
        "maxSpeed": "Max speed",
        "avgSpeed": "Average speed"
    };
    $scope.periods = {
        "d": "Day",
        "w": "Week",
        "M": "Month",
        "y": "Year"
    };
    $scope.period = "w";
    $scope.measure = "duration";
    var humanizeDuration = require("humanize-duration");
    var formatMeasure = function(value) {
        if ($scope.measure === "duration") {
            value = humanizeDuration(Math.round(
                value / 60) * 60 * 1000);
        } else if ($scope.measure === "avgHeartRate") {
            value = d3.format(".2f")(value) + " bpm";
        } else if ($scope.measure === "energy") {
            value = Math.round(value) + " kcal";
        } else if ($scope.measure === "avgSpeed" || $scope.measure ===
            "maxSpeed") {
            value = d3.format(".2f")(value * 3.6) + " km/h";
        }
        return value;
    };
    var drawing = false;
    var draw = function() {
        if (drawing) {
            return;
        }
        drawing = true;
        $http.get("/data/time/" +
                encodeURIComponent($scope.measure) +
                "/" + encodeURIComponent($scope.period) +
                "?from=" + encodeURIComponent(moment.utc($scope.dateFrom
                        .value)
                    .format()) +
                "&to=" + encodeURIComponent(moment.utc($scope.dateTo.value)
                    .format())
            )
            .then(function(response) {
                var columns = [
                    ["x"],
                    [$scope.measures[$scope.measure]],
                    ["Average"]
                ];
                response.data.forEach(function(value) {
                    columns[0].push(moment(value.time)
                        .format("YYYY-MM-DD"));
                    columns[1].push(value.v);
                    columns[2].push(value.avg);
                });
                c3.generate({
                    bindto: "#chart",
                    data: {
                        x: "x",
                        columns: columns
                    },
                    axis: {
                        x: {
                            type: "timeseries",
                            tick: {
                                format: "%Y-%m-%d"
                            }
                        },
                        y: {
                            tick: {
                                format: formatMeasure
                            }
                        }
                    }
                });
                drawing = false;
                return response.data;
            })
            .catch(function() {
                drawing = false;
            });
    };

    var change = function() {
        draw();
    };

    $scope.$watch("measure", change);
    $scope.$watch("period", change);
    $scope.$watch("dateFrom.value", change);
    $scope.$watch("dateTo.value", change);

    draw();
};

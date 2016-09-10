"use strict";
module.exports = function($scope, $http) {
    require("c3/c3.css");
    var c3 = require("c3");
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
        .subtract(6, "months")
        .toDate();
    $scope.dateTo = new DateSelector();
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
                    [$scope.measures[$scope.measure]],
                    ["Average"]
                ];
                response.data.forEach(function(value) {
                    columns[0].push(value.v);
                    columns[1].push(value.avg);
                });
                c3.generate({
                    bindto: "#chart",
                    data: {
                        columns: columns
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

"use strict";
module.exports = function($scope) {
    var DateSelector = function() {
        this.value = new Date();
        this.opened = false;
        var self = this;
        this.open = function() {
            self.opened = true;
        };
    };
    $scope.dateFrom = new DateSelector();
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
        "m": "Month",
        "y": "Year"
    };
    $scope.period = "w";
    $scope.measure = "duration";
    require("c3/c3.css");
    var c3 = require("c3");
    var drawing = false;
    var draw = function() {
        if (drawing) {
            return;
        }
        drawing = true;
        c3.generate({
            bindto: "#chart",
            data: {
                columns: [
                    ["data1", 30, 200, 100, 400, 150, 250],
                    ["data2", 50, 20, 10, 40, 15, 25]
                ]
            }
        });
        drawing = false;
    };

    $scope.change = function() {
        draw();
    };
    draw();
};

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
};

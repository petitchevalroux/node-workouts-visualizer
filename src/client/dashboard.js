"use strict";

require.ensure(["angular"], function(require) {
    var angular = require("angular");
    require.ensure(["angular-ui-bootstrap"], function(require) {
        require("bootstrap/dist/css/bootstrap.css");
        require("angular-ui-bootstrap");
        angular.module("dashboard", ["ui.bootstrap"])
            .directive("myDropdownSelect", require(
                "./directives/dropdown-select.js"))
            .controller("DashboardCtrl", function($scope) {
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
            });
    }, "ng-ui-bootstrap");
}, "ng");

"use strict";

require.ensure(["angular"], function(require) {
    var angular = require("angular");
    require.ensure(["angular-ui-bootstrap"], function(require) {
        require("bootstrap/dist/css/bootstrap.css");
        require("angular-ui-bootstrap");
        var dashboard = angular.module("dashboard", [
            "ui.bootstrap"
        ]);
        dashboard.controller("DashboardCtrl", function($scope) {
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
            var measures = {
                "duration": "Duration",
                "distance": "Distance",
                "avgHeartRate": "Heart rate",
                "energy": "Energy",
                "maxSpeed": "Max speed",
                "avgSpeed": "Average speed"
            };

            var DropdownSelector = function(values) {
                this.sort = function(options) {
                    return options.sort(
                        function(a, b) {
                            if (a.label < b
                                .label) {
                                return -1;
                            } else if (a.label >
                                b.label) {
                                return 1;
                            }
                            return 0;
                        });
                };
                this.options = [];
                var self = this;
                Object.getOwnPropertyNames(values)
                    .forEach(function(value) {
                        self.options.push({
                            "label": values[
                                value
                            ],
                            "value": value
                        });
                    });
                this.options = this.sort(this.options);
                this.others = [];
                if (this.options.length > 0) {
                    this.selected = this.options[0];
                    if (this.options.length > 1) {
                        for (var i = 1; i < this.options
                            .length; i++) {
                            this.others.push(this.options[
                                i]);
                        }
                    }
                }
                this.select = function(
                    selectedValue) {
                    self.others = [];
                    self.options.forEach(
                        function(v, i) {
                            if (
                                selectedValue ===
                                self.options[
                                    i].value
                            ) {
                                self.selected =
                                    self.options[
                                        i];
                            } else {
                                self.others
                                    .push(
                                        self
                                        .options[
                                            i
                                        ]);
                            }
                        });
                };
            };
            $scope.dropdownMesure = new DropdownSelector(
                measures);
        });
    }, "ng-ui-bootstrap");
}, "ng");

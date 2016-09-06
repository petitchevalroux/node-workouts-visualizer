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
            $scope.today = function() {
                $scope.dt = new Date();
            };
            $scope.today();
            $scope.format = "yyyy-MM-dd";

            $scope.popupFrom = {
                opened: false
            };
            $scope.openPopupFrom = function() {
                $scope.popupFrom.opened = true;
            };

            $scope.dateOptions = {
                formatYear: "yyyy",
                maxDate: new Date(2020, 5, 22),
                minDate: new Date(),
                startingDay: 1
            };
        });
    }, "ng-ui-bootstrap");
}, "ng");

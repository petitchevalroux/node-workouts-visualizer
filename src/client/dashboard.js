"use strict";

require.ensure(["angular"], function(require) {
    var angular = require("angular");
    require.ensure(["angular-ui-bootstrap"], function(require) {
        require("bootstrap/dist/css/bootstrap.css");
        require("angular-ui-bootstrap");
        angular.module("dashboard", ["ui.bootstrap"])
            .directive("myDropdownSelect", require(
                "./directives/dropdown-select.js"))
            .controller("DashboardCtrl", ["$scope", "$http",
                require(
                    "./controllers/timeserie.js")
            ]);
    }, "ng-ui-bootstrap");
}, "ng");

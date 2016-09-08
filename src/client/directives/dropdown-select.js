"use strict";
module.exports = function() {
    return {
        "link": function($scope) {
            var sort = function(options) {
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
            var options = [];
            Object.getOwnPropertyNames($scope.items)
                .forEach(function(value) {
                    options.push({
                        "label": $scope.items[
                            value
                        ],
                        "value": value
                    });
                });
            options = sort(options);
            $scope.others = [];
            if (options.length > 0) {
                $scope.selected = options[0];
                $scope.ngModel = options[0].value;
                if (options.length > 1) {
                    for (var i = 1; i < options
                        .length; i++) {
                        $scope.others.push(options[
                            i]);
                    }
                }
            }
            $scope.select = function(selectedValue) {
                $scope.others = [];
                $scope.ngModel = selectedValue;
                options.forEach(
                    function(item) {
                        if (selectedValue === item.value) {
                            $scope.selected = item;

                        } else {
                            $scope.others.push(item);
                        }
                    });
            };
        },
        "restrict": "A",
        "templateUrl": "/assets/templates/directives/dropdown-select.html",
        "scope": {
            "items": "=",
            "ngModel": "="
        }
    };
};

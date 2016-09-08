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

            var change = function() {
                if (typeof $scope.ngChange === "function") {
                    $scope.ngChange();
                }
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
            $scope.select = function(selectedValue, emitChange) {
                emitChange = typeof emitChange === "undefined" ? true : emitChange;
                $scope.others = [];
                $scope.ngModel = selectedValue;
                if(emitChange) {
                    change();
                }
                options.forEach(
                    function(item) {
                        if (selectedValue === item.value) {
                            $scope.selected = item;

                        } else {
                            $scope.others.push(item);
                        }
                    });
            };

            if (options.length > 0) {
                if (options.length > 1) {
                    for (var i = 1; i < options
                        .length; i++) {
                        $scope.others.push(options[
                            i]);
                    }
                }
                $scope.select($scope.ngModel || options[0].value, false);
            }
        },
        "restrict": "A",
        "templateUrl": "/assets/templates/directives/dropdown-select.html",
        "scope": {
            "items": "=",
            "ngModel": "=",
            "ngChange": "="
        }
    };
};

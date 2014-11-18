'use strict'

realm.directive('numericInput', function () {
    return    {
        restrict: 'E',
        replace: true,

        scope: {
            min: '=',
            max: '=',
            step: '=',
            value: '='
        },
        template: '<input type="number" ng-model="inputValue" >',

        controller: function ControllingFunction($scope, $element, $attrs, $rootScope) {
            $scope.inputValue = $scope.value;


        },
        compile: function CompilingFunction(element, attrs) {


            return function LinkingFunction(scope, element, attrs, ctrl) {


            }//link
        }//compile
    }
});//directive

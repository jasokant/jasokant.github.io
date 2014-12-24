'use strict';

realm_components.directive('poseStateComponent', ['$timeout', '$http', '$q', 'RobotService', function($timeout, $http, $q, RobotService) {

    return {
        restrict: 'E',
        replace: false,
        scope: true,
        template:   '<div class="pose-state-component__container">' +
                        '<h3 class="pose-state-component__header">Position</h3>' +
                        
                        '<div class="pose-state-component__item" ng-repeat="(key, value) in data.position">' +
                            '<h4 class="pose-state-component__item__key">{{key | uppercase}}: </>' +
                            '<h4 class="pose-state-component__item__value">{{value}}</>' +
                        '</div>' +
                        
                        '<h3 class="pose-state-component__header">Orientation</h3>' +
                       
                        '<div class="pose-state-component__item">' +
                            '<h4 class="pose-state-component__item__key">R: </>' +
                            '<h4 class="pose-state-component__item__value">{{data.orientation.x}}</>' +
                        '</div>'+
                        '<div class="pose-state-component__item clearfix">' +
                            '<h4 class="pose-state-component__item__key">P: </>' +
                            '<h4 class="pose-state-component__item__value"> {{data.orientation.y}}</>' +
                        '</div>'+
                        '<div class="pose-state-component__item clearfix">' +
                            '<h4 class="pose-state-component__item__key">Y: </>' +
                            '<h4 class="pose-state-component__item__value"> {{data.orientation.z}}</>' +
                        '</div>'+
                    '</div>',
        controller: function ControllerFunction($scope, $element, $attrs, $rootScope)
        {
            $scope.data = {};
            
            var robotPath = $scope.component.url;

            var getPoseState = function(){
                RobotService.getPose(robotPath).then(function(poseState){
                    $scope.data.position = poseState.position;
                    $scope.data.orientation = poseState.orientation;
                    setTimeout(getPoseState,30);
                }, function(response){
                    console.log(response);
                    setTimeout(getPoseState,30);
                });
            };

            getPoseState();
        },

        compile: function CompilingFunction(tElement, tAttrs)
        {
            //can only manipulate DOM here (can't access scope yet)
            return function LinkingFunction(scope, element, attrs, ctrl) {
                //can access scope now
            }
        }

    }
}]);
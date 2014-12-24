'use strict';

angleInputComponentModule.directive('angleInputComponent', ['$timeout', '$interval','$http', '$q', 'RobotService', '$mdDialog', function ($timeout, $interval, $http, $q, RobotService, $mdDialog) {

    return {
        restrict: 'E',
        replace: false,
        scope:true,
        template:
            '<div class="angle-input-component__container">' +
                '<form name="angleInputForm" class="angle-input-form" flex>'+
                  '<md-button class="angle-input-component__button md-raised md-primary" ng-click="submitAngleSet(vm.angleSet)">Send Angles</md-button>'+
                  '<md-button class="angle-input-component__button md-raised md-primary">Go Home</md-button>'+
                  '<div class="angle-input-groups">'+
                    '<div class="angle-input-group" ng-repeat="angle in vm.angleSet.angles">'+
                      '<label class="angle-input-group__label">{{angle.name}}</label>'+
                      '<label class="angle-input-group__value">{{angle.value.toFixed(2)}} rad</label>'+
                      '<md-slider class="angle-input-group__slider" ng-model="angle.value" min="-6.28" max="6.28" step="0.04"></md-slider>'+
                    '</div>'+
                  '</div>'+
                '</form>' +
                '<div content-for="component-card__toolbar-button-container">'+
                  '<md-button class="component-card__toolbar-button component-card-toolbar__save-angleset-button" ng-click="saveAngleSet()"><i class="mdi mdi-save"></i><md-tooltip>Save Angle Set</md-tooltip></md-button>'+
                  '<md-button class="component-card__toolbar-button component-card-toolbar__list-anglesets-button" ng-click="listAngleSets()" ng-disabled="vm.isSavedAngleSetsEmpty"><i class="mdi mdi-list"></i><md-tooltip>Load Angle Set</md-tooltip></md-button>'+
                '</div>'+
            '</div>',

        controller: function ControllerFunction($scope, $element, $attrs, $rootScope) {
            var robotPath = $scope.component.url;

            $scope.vm={};

            $scope.vm.savedAngleSets = [];
            $scope.vm.isSavedAngleSetsEmpty = true;

            $scope.vm.angleSet = {
                name: 'Untitled Set',
                readable:true,
                angles: [
                    {
                        name: 'Base',
                        value: 0.00
                    },
                    {
                        name: 'Shoulder',
                        value: 0.00
                    },
                    {
                        name: 'Arm',
                        value: 0.00
                    },
                    {
                        name: 'Forearm',
                        value: 0.00
                    },
                    {
                        name: 'Wrist 1',
                        value: 0.00
                    },
                    {
                        name: 'Wrist 2',
                        value: 0.00
                    }
                ]
            };

            //get the current angle joints
            RobotService.getJoints(robotPath).then(function(angleState){
               $scope.vm.angleSet.angles[0].value = parseFloat(angleState.radians[0].toFixed(4));
               $scope.vm.angleSet.angles[1].value = parseFloat(angleState.radians[1].toFixed(4));
               $scope.vm.angleSet.angles[2].value = parseFloat(angleState.radians[2].toFixed(4));
               $scope.vm.angleSet.angles[3].value = parseFloat(angleState.radians[3].toFixed(4));
               $scope.vm.angleSet.angles[4].value = parseFloat(angleState.radians[4].toFixed(4));
               $scope.vm.angleSet.angles[5].value = parseFloat(angleState.radians[5].toFixed(4));
            },
                function(response){
                console.log(response);
            });



            //sets the name and saves the current set
            $scope.saveAngleSet = function () {
                $mdDialog.show({
                  templateUrl:'realm-components/angleInput/partials/angleInput.enterAngleSetNameDialog.tpl.html',
                  controller:'enterAngleSetNameDialogController'
                }).then(function(answer){
                  $scope.vm.isSavedAngleSetsEmpty = false;  
                  $scope.vm.angleSet.name=answer;
                  $scope.vm.savedAngleSets.push(angular.copy($scope.vm.angleSet));
                  console.log("saved angles:");
                  console.log($scope.vm.savedAngleSets);
                });   
            };

            $scope.listAngleSets = function(){
                $rootScope.tempAngleSets = $scope.vm.savedAngleSets;

                $mdDialog.show({
                    templateUrl:'realm-components/angleInput/partials/angleInput.loadAngleSetDialog.tpl.html',
                    controller:'loadAngleSetDialogController'
                }).then(function(answer){
                    $scope.loadAngleSet(answer);

                    $scope.vm.savedAngleSets = $rootScope.tempAngleSets;
                    if($scope.vm.savedAngleSets.length === 0)
                        $scope.vm.isSavedAngleSetsEmpty = true;
                })
            }
            //loads the current set
            $scope.loadAngleSet = function (loadedAngleSet) {
                console.log("load the following angle set");
                console.log(loadedAngleSet);
                $scope.vm.angleSet=angular.copy(loadedAngleSet)
            };

            //deletes the set
            $scope.deleteSavedAngleSet = function (name,index) {

              //  var index=$scope.find(name);
              //  console.log("name "+name+" @ index "+index+" will be deleted");
                $scope.vm.savedAngleSets.splice(index,1);
            };

            //edits the current set
            $scope.editSavedAngleSet=function(name,index)
            {
             //   var index=$scope.find(name);
                $scope.vm.savedAngleSets[index].readable=false;
                $(".menu-input:eq("+index+")").focus();
                console.log("name "+name+" @ index "+index+" will be re-named");
                console.log($scope.vm.savedAngleSets);
            };

            //finds the index of an element by name
           /* $scope.find=function(name)
            {
                var index=0;
                for(var i=0;i<$scope.savedAngleSets.length;i++)
                {
                    if($scope.savedAngleSets[i].name==name)
                    {
                        index=i;
                    }
                }
                return index;
            };*/

            $scope.goHome=function()
            {
                //RobotService.goHome(robotPath);
            }

            //submits the current set
            $scope.submitAngleSet = function (angleSet) {
                var angleArray = [];
                for (var i = 0; i < angleSet.angles.length; i++) {
                    angleArray.push(parseFloat(angleSet.angles[i].value));
                }
                console.log('Sent the following angles to arm:');
                console.log(angleArray);

                //RobotService.setJoints(robotPath, angleArray);
            };


        },
        compile: function CompilingFunction(tElement, tAttrs) {
            //can only manipulate DOM here (can't access scope yet)
            return function LinkingFunction(scope, element, attrs, ctrl) {
                //can access scope now
                    $(element).bind('focusout', function () {

                        for(var i=0;i<scope.savedAngleSets.length;i++)
                        {
                            scope.vm.savedAngleSets[i].readable=true;
                        }
                });
            }
        }
    }
}]);
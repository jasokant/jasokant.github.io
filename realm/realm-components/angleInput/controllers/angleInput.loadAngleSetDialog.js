'use strict';

angleInputComponentModule.controller('loadAngleSetDialogController', function($scope, $rootScope, $timeout, $mdSidenav, $mdDialog) {
  
  $scope.vm = {
  }

  $scope.vm.angleSets = $rootScope.tempAngleSets;

  

  $scope.hide = function(answer) {
    $mdDialog.hide(answer);
  };

  $scope.cancel = function() {
    $mdDialog.cancel();
  };

  $scope.loadAngleSet = function(angleSet) {
    $mdDialog.hide(angleSet);
  };

  $scope.deleteAngleSet = function(index)
  {
    $rootScope.tempAngleSets.splice(index,1);
    $scope.vm.angleSets = $rootScope.tempAngleSets;
    if($scope.vm.angleSets.length === 0)
      $scope.cancel();
  };
})
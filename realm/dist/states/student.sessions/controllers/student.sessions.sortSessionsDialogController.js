'use strict';

angular.module('realm').controller('sortSessionsDialogController', function($scope, $timeout, $mdSidenav, $mdDialog) {
  
  $scope.vm = {
    predicateOption: 'startDate',
    reverseOption: 'false',
    showPastOption: 'false'
  }

  $scope.hide = function() {
    $mdDialog.hide();
  };

  $scope.cancel = function() {
    $mdDialog.cancel();
  };

  $scope.answer = function() {
    if($scope.vm.reverseOption === 'true')
      $scope.vm.reverseOption = true;
    else
      $scope.vm.reverseOption = false;

    if($scope.vm.showPastOption === 'true')
      $scope.vm.showPastOption = true;
    else
      $scope.vm.showPastOption = false;

    $mdDialog.hide($scope.vm);
  };
})
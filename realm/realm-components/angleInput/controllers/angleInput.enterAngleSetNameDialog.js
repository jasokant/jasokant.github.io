'use strict';

angleInputComponentModule.controller('enterAngleSetNameDialogController', function($scope, $timeout, $mdSidenav, $mdDialog) {
  
  $scope.vm = {
  	newAngleSetName:""
  }

  $scope.hide = function() {
    $mdDialog.hide();
  };

  $scope.cancel = function() {
    $mdDialog.cancel();
  };

  $scope.answer = function(answer) {
    $mdDialog.hide(answer);
  };
})
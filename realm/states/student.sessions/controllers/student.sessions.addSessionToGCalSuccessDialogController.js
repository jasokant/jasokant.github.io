'use strict';

angular.module('realm').controller('addSessionToGCalSuccessDialogController', function($scope, $timeout, $mdSidenav, $mdDialog) {
  
  $scope.vm = {
  	sessionToken:""
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
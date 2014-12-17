'use strict';

angular.module('realm').controller('loginErrorDialogController', function($scope, $timeout, $mdSidenav, $mdDialog) {
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
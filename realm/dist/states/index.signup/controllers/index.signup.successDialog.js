'use strict';

angular.module('realm')
.controller('SignupSuccessDialogController', function($scope, $mdDialog, $state) {
  $scope.hide = function() {
    $mdDialog.hide();
    $state.go('index.login');
  };

  $scope.cancel = function() {
    $mdDialog.cancel();
  };

  $scope.answer = function(answer) {
    $mdDialog.hide(answer);
  };
});
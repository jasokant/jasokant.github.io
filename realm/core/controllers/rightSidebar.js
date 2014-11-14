'use strict';

angular.module('REALM').controller('RightCtrl', function($scope, $timeout, $mdSidenav) {
  $scope.close = function() {
    $mdSidenav('right').close();
  };
})
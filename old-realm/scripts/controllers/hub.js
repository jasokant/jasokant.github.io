'use strict';

angular.module('REALM')
  .controller('HubController', function ($scope, $rootScope) {
    $scope.model.title= "HUB";
    
    $scope.startForwardKinematics = function()
    {
        $rootScope.go('/forwardkinematics','slideLeft');
    }
  });
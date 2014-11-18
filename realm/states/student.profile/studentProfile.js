'use strict';

angular.module('realm')
.controller('StudentProfileController', function ($scope, $rootScope, AuthService, state) {

        $scope.user = AuthService.getCurrentUser().value;
        console.log($scope.user);
    
});
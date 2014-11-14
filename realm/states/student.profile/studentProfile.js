'use strict';

angular.module('REALM')
.controller('StudentProfileController', function ($scope, $rootScope, AuthService, state) {

        $scope.user = AuthService.getCurrentUser().value;
        console.log($scope.user);
    
});
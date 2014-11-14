'use strict';

angular.module('REALM')
.controller('SignupController', function ($scope, $rootScope, $http, $q, AuthService, RepoService, $state, $mdDialog, $mdToast) {
    
    $scope.$parent.vm.selectedIndex=1;

    $scope.accountDetails = {
        name:'',
        email:'',
        password:'',
        confirmPassword:''
    };

    $scope.signup = function(){
        AuthService.signup($scope.vm.credentials).then(function(){
            $rootScope.$broadcast('auth-signup-success');
        }, function(errorCode){
            $rootScope.$broadcast('auth-signup-error', errorCode);
        });
    }

    $scope.$on('auth-signup-success', function(event, personObject) {
        $state.go('index.login');

        $mdDialog.show({
            templateUrl: 'states/index.signup/partials/index.signup.successDialog.tpl.html',
            controller: DialogController
        });
    });

    $scope.$on('auth-signup-error', function(event, errorCode) {

        $mdDialog.show({
            templateUrl: 'states/index.signup/partials/index.signup.errorDialog.tpl.html',
            controller: DialogController
        });
    });
});
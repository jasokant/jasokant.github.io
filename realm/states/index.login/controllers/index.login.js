'use strict';

angular.module('REALM')
.controller('LoginController', function ($scope, $rootScope, AuthService, RepoService, $mdDialog, $state) {
    
    $scope.$parent.vm.selectedIndex = 0;

    $scope.vm = {
        credentials: {
            email:'',
            password:''
        }
    }
    
    
    $scope.login = function(){
        AuthService.login($scope.vm.credentials).then(function(personObject){
            $rootScope.$broadcast('auth-login-success', personObject);
        }, function(errorCode){
            $rootScope.$broadcast('auth-login-error', errorCode);
        });
    }

    $scope.$on('auth-login-success', function(event, personObject) {
        
        //after successful login, find out user's role and redirect to appropriate state
        var personLocation = personObject.loc;

        /*RepoService.getObject('Role', personObject.value.role.loc)
        .then(function(response){
            var role=response.data.value.name;

            switch(role)
            {
                case 'student':
                    $state.go('student.sessions');
                    break

                case 'teacher':
                    $state.go('teacher.sessions');
                    break

                case 'admin':
                    $state.go('admin');
                    break
            }

            console.log(response);
        },function(response){
            console.log('Failed to get role')
        });*/
        $state.go('student.sessions');
    });

    $scope.$on('auth-login-error', function(event, errorCode) {
        $mdDialog.show({
            templateUrl: 'states/index.login/partials/index.login.errorDialog.tpl.html',
            controller: DialogController
        });
    });
    

});


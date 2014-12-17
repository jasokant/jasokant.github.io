'use strict';

angular.module('realm')
.controller('IndexController', function ($scope, $rootScope, AuthService, $state) { 
	$scope.vm = {
		selectedIndex: null //gets set by child controllers
	}
});

    
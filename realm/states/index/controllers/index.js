'use strict';

angular.module('REALM')
.controller('IndexController', function ($scope, $rootScope, AuthService, $state) {

	$scope.vm = {
		selectedIndex: null //gets set by child controllers
	}

});

    
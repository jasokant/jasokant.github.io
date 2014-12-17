'use strict';

realm.controller('MainController', function($rootScope, $scope, AuthService, $mdSidenav){

  $scope.openLeft = function()
  {
  	$mdSidenav('left').open();
  }

});
'use strict';

angular.module('REALM').config(function ($stateProvider, $urlRouterProvider, $httpProvider) {

	$stateProvider
		.state('index.signup', {
        url: '/signup',
        controller: 'SignupController',
        templateUrl:'states/index.signup/partials/index.signup.tpl.html'
      });

});
'use strict';

angular.module('realm').config(function ($stateProvider, $urlRouterProvider, $httpProvider) {

		$stateProvider
	    	.state('index.login', {
        		url: '/login',
        		controller:'LoginController',
        		templateUrl:'states/index.login/partials/index.login.tpl.html'
      		})
	
	});
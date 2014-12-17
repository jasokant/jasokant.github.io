'use strict';

angular.module('realm')

.config(function ($stateProvider, $urlRouterProvider, $httpProvider) {

	$stateProvider
	    .state('index', {
	        url: '/index',
	        abstract: true,
	        controller:'IndexController',
	        templateUrl: 'states/index/partials/index.tpl.html'
	    });

});
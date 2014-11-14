'use strict';

angular.module('REALM')

.config(function ($stateProvider, $urlRouterProvider, $httpProvider) {

	$stateProvider
	    .state('student.sessions', {
	        url: '/sessions',
	        controller:'StudentSessionsController',
	        templateUrl: 'states/student.sessions/partials/student.sessions.tpl.html'
	    });

});
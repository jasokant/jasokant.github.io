'use strict';

angular.module('realm')

.config(function ($stateProvider, $urlRouterProvider, $httpProvider) {

	$stateProviders
	    .state('student', {
	        url: '/student',
	        abstract: true,
	        controller:'StudentController',
	        templateUrl: 'states/index/partials/student.tpl.html'
	    });

});
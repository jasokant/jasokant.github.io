'use strict';

angular.module('realm')

.config(function ($stateProvider, $urlRouterProvider, $httpProvider) {

	$stateProvider
	    .state('student', {
	        url: '/student',
	        abstract: true,
	        controller:'StudentController',
	        templateUrl: 'states/student/partials/student.tpl.html'
	    });

});
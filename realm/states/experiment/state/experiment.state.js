'use strict';

angular.module('realm')

.config(function ($stateProvider, $urlRouterProvider, $httpProvider) {

	$stateProvider
	    .state('experiment', {
	        url: '/experiment/:assignmentLocation',
	        controller:'ExperimentController',
	        templateUrl: 'states/experiment/partials/experiment.tpl.html'
	    });
});
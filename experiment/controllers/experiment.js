'use strict';

angular.module('realm').controller('ExperimentController', ['$scope', '$rootScope', '$location', '$interval', '$timeout', 'CameraFeedService', 'RobotService', '$q', '$stateParams', function ($scope, $rootScope, $location, $interval, $timeout, CameraFeedService, RobotService, $q, $stateParams) {

		$scope.assignmentLocation = $stateParams.assignmentLocation;

		//get layout.json file from assignment
		
		//Entry delay for animations
		$timeout(function(){
			$('.mdi-autorenew').hide();
		},2000);
]);
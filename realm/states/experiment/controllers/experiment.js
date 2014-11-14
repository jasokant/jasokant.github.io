'use strict';

angular.module('REALM').controller('ExperimentController', ['$scope', '$rootScope', '$location', '$interval', '$timeout', 'CameraFeedService', 'RobotService', '$q', '$stateParams', function ($scope, $rootScope, $location, $interval, $timeout, CameraFeedService, RobotService, $q, $stateParams) {

		$scope.assignmentLocation = $stateParams.assignmentLocation;

		//get layout.json file from assignment

		var layout = {
			components:[{
				'componentType': 'cameraFeed',
				'layout':'vertical',
				'flex-sm':50,
				'offset-sm':33,
				'flex-md':25,
				'offset-md':20,
				'flex-lg':20,
				'offset-lg':20
			}]
		}
    }
]);
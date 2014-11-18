'use strict';

var deps = [
	'AuthService',
	'CameraFeedService',
	'RepoService',
	'RobotService'
];

var realm_services = angular.module('realm.services', deps);

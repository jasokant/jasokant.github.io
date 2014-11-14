'use strict';

angular.module('REALM')
.controller('StudentSessionsController', function ($scope, $rootScope, AuthService, $state, $http, $q,RepoService, $mdDialog) {

	var layout={};

	$scope.vm = {
		sessions:[{
			loc:'Session-1',
	        assignment: {
	        	name:'Forward Kinematics',
	        	loc:'Assignment-1'
	    	},
	        startDate: moment().subtract(1,'days'),
	        endDate: moment().add(1,'days'),
	        sessionToken: 'asdfaQWEerfzfsxd1231',
	        devices: ['mico']
	    },{
	        loc:'Session-2',
	        assignment: {
	        	name:'Inverse Kinematics',
	        	loc:'Assignment-2'
	    	},
	        startDate: moment().add(1,'days'),
	        endDate: moment().add(2,'days'),
	        sessionToken: 'asdfaQWEerfzfsxd1231',
	        devices: ['mico']
	    },{
	        loc:'Session-3',
	        assignment: {
	        	name:'Teach Points',
	        	loc:'Assignment-3'
	    	},
	        startDate: moment().subtract(2,'days'),
	        endDate: moment().subtract(1,'days'),
	        sessionToken: 'asdfaQWEerfzfsxd1231',
	        devices: ['mico']
	    },{
	        loc:'Session-4',
	        assignment: {
	        	name:'PID',
	        	loc:'Assignment-4'
	    	},
	        startDate: moment(),
	        endDate: moment().add(1,'days'),
	        sessionToken: 'asdfaQWEerfzfsxd1231',
	        devices: ['mico']
	    }]//,
	    //sessions:[{}]
	}

	$scope.vm.sessions.forEach(function(element,index,array){
		element.isActive = moment().isAfter(element.startDate) && moment().isBefore(element.endDate);
	});

	$scope.addSession = function(ev) {
		/*$mdDialog.show({
			templateUrl: 'states/student.sessions/partials/student.sessions.joinSessionDialog.tpl.html',
			targetEvent: ev,
			controller: 'DialogController'
		}).then(function(){
			console.log('dialog OK')
		},function(){
			console.log('dialog CLOSED')
		})*/
		
		$scope.vm.sessions.unshift({});
	}

	$scope.removeSession = function(index) {
		$scope.vm.sessions.shift();
	}

	$scope.launchExperiment = function(assignmentLocation) {
		$state.go('experiment',{assignmentLocation: assignmentLocation});
	}

});
'use strict';

angular.module('realm')
.controller('StudentSessionsController', function ($scope, $rootScope, AuthService, GAuthService, $state, $http, $q,RepoService, $mdDialog) {

	var layout={};

	$scope.vm = {
		predicate: 'startDate',
		reverse: false,
		showPast:false,
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
		$mdDialog.show({
			templateUrl: 'states/student.sessions/partials/student.sessions.joinSessionDialog.tpl.html',
			targetEvent: ev,
			controller: 'joinSessionDialogController'
		}).then(function(sessionToken){
			console.log('dialog OK');
			$scope.vm.sessions.unshift({
				'sessionToken': sessionToken
			});
		},function(){
			console.log('dialog CLOSED');
		})
		
		
	}

	$scope.removeSession = function(index) {
		$scope.vm.sessions.shift();
	}

	$scope.addSessionToGCal = function(session) {
		var eventResource = {
	      'calendarID': GAuthService.userCalendarId,
	      'sendNotifications': true,
	      'description': session.assignment.name,
	      'start':{
	      	'dateTime': session.startDate.format()
	      },
	      'end':{
	      	'dateTime':	session.endDate.format()
	      }

	    }

		GAuthService.authorize(GAuthService.createSessionEvent(eventResource));
	}

	$scope.launchExperiment = function(assignmentLocation) {
		$state.go('experiment',{assignmentLocation: assignmentLocation});
	}

	$scope.myFilter = function(item)
	{
		if($scope.vm.showPast) return true;
		else return !item.endDate.isBefore(moment());
	}
});
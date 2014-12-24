'use strict';

angular.module('realm')
.controller('StudentSessionsController', function ($scope, $rootScope, AuthService, GAuthService, $state, $http, $q,RepoService, $mdDialog, $timeout, $mdSidenav) {
	var layout={};

	$scope.vm = {
		predicate: 'startDate',
		reverse: false,
		showPast: true
	}

	//Entry delay for animations
	$timeout(function(){
		$('md-progress-linear').addClass('animated fadeOut');

		$scope.vm.sessions = [{
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
	    }];

	    $scope.vm.sessions.forEach(function(element,index,array){
			element.isActive = moment().isAfter(element.startDate) && moment().isBefore(element.endDate);
		});

		$('.join-session-button, .sort-sessions-button').addClass('animated rubberBand');

		
	},2000);
	

	$scope.addSession = function(ev) {
		$mdDialog.show({
			templateUrl: 'states/student.sessions/partials/student.sessions.joinSessionDialog.tpl.html',
			targetEvent: ev,
			controller: 'joinSessionDialogController'
		}).then(function(sessionToken){
			console.log('dialog OK');
			$scope.vm.sessions.unshift({
				loc:'Session-1',
		        assignment: {
		        	name:'Forward Kinematics',
		        	loc:'Assignment-1'
		    	},
		        startDate: moment().subtract(1,'days'),
		        endDate: moment().add(1,'days'),
		        sessionToken: sessionToken,
		        devices: ['mico']
		    });

			$scope.reloadSessions();
		},function(){
			console.log('dialog CLOSED');
		});
		
		
	}

	$scope.removeSession = function(index) {
		$scope.vm.sessions.shift();
	}

	$scope.addSessionToGCal = function(session) {
		gapi.client.load('calendar','v3',function(){
			GAuthService.authorize().then(function(){
				console.log(gapi);
				//SUCCESS
				GAuthService.getSessionsCalendarId().then(function(calendarId){
			      //SUCCESS
			      GAuthService.createEvent(calendarId, true, session.assignment.name, session.startDate.format(), session.endDate.format()).then(function(){
			        //SUCCESS
			        $mdDialog.show({
						templateUrl: 'states/student.sessions/partials/student.sessions.addSessionToGCalSuccessDialog.tpl.html',
						controller: 'addSessionToGCalSuccessDialogController'
					})
						.then(function(){
							console.log('dialog OK');
						},function(){
							console.log('dialog CLOSED');
						});

			      },function(){
			        //FAILURE
			        $mdDialog.show({
						templateUrl: 'states/student.sessions/partials/student.sessions.addSessionToGCalFailureDialog.tpl.html',
						controller: 'addSessionToGCalFailureDialogController'
					})
						.then(function(){
							console.log('dialog OK');
						},function(){
							console.log('dialog CLOSED');
						});
			      });
			    },function(){
			      //FAILURE
			    })

			}, function(){
				//FAILURE
			});
		});
	}

	$scope.menuButtonClicked = function()
	{
		$mdSidenav('left').toggle();
	}

	$scope.launchExperiment = function(sessionToken) {
		$state.go('experiment',{sessionToken: sessionToken});
	}

	$scope.sortSessions = function(){
		$mdDialog.show({
			templateUrl: 'states/student.sessions/partials/student.sessions.sortSessionsDialog.tpl.html',
			controller: 'sortSessionsDialogController'
		}).then(function(answer){
			if($scope.vm.predicate !== answer.predicateOption || $scope.vm.reverse !== answer.reverseOption || $scope.vm.showPast !== answer)
			{	
				$scope.reloadSessions();

				$scope.vm.predicate = answer.predicateOption;
				$scope.vm.reverse = answer.reverseOption;
				$scope.vm.showPast = answer.showPastOption;
			}
		},function(){
			console.log('dialog CLOSED');
		})
	}

	$scope.reloadSessions = function()
	{
		var temp = $scope.vm.sessions;
		$scope.vm.sessions = null;

		$('.mdi-autorenew').show();

		$timeout(function(){
			$('.mdi-autorenew').hide();

			$scope.vm.sessions = temp;

			$scope.vm.sessions.forEach(function(element,index,array){
				element.isActive = moment().isAfter(element.startDate) && moment().isBefore(element.endDate);
			});
		},2000);
	}

	$scope.pastFilter = function(item)
	{
		if($scope.vm.showPast) return true;
		else return !item.endDate.isBefore(moment());
	}
});
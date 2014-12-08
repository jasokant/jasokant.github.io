'use strict';

angular.module('REALM')
.controller('StudentSessionsController', function ($scope, $rootScope, AuthService, AUTH_EVENTS, $state, $http, $q,RepoService) {
	$scope.sessionTokenString = "";
    $scope.dynamicSessions=[];
    var sessions=RepoService.getSessionsFromUser();
    readSessions(sessions);
//-----------------------------------------------------------------------------------------------
    function readSessions(sessions) {
        if (sessions !== null && sessions !== "" && sessions !== undefined) {
            $scope.dynamicSessions=[];
            var sessionValue=sessions.value;
            console.log("sessions are not null")
            for (var i = 0; i < sessionValue.length; i++) {
                console.log("In studentSessions:: values of sessions:  " + sessionValue[i].loc);
                RepoService.getSession(sessionValue[i].loc).then(function(response)
                {   console.log("in")
                    $scope.dynamicSessions.push(createSession(response.data));
                    $scope.date();
                    $scope.dynamicSessions.sort(function(a,b) { return parseFloat(a.order) - parseFloat(b.order) } );
                    console.log($scope.dynamicSessions)
                },function(response)
                {
                    console.log(response.status);
                });
            }//end of for
        }//end of if
    }//end of function
//---------------------------------------------------------------------------------------
    function createSession(returnedSession)
    {
       var start=new Date(returnedSession.value.startTime);
       var startMili=start.getTime();
       var durationMili= returnedSession.value.duration*60*1000;
       var endDateMili= startMili+durationMili;
       var endDate=new Date(endDateMili);
       var session=new Object();
       if(returnedSession.loc=="Session-1")
       {
           session.assignment="Forward Kinematics"
           session.experimentType= 'forwardKinematics'
           session.order="2"
       }
        if(returnedSession.loc=="Session-2")
        {
            session.assignment="Inverse Kinematics"
            session.experimentType= 'inverseKinematics'
            session.order="3"
        }
        if(returnedSession.loc=="Session-3")
        {
            session.assignment="Teach Points"
            session.experimentType= 'teachPoints'
            session.order="1"
        }
       session.course="Introduction to Robotics"
       session.startDateTime= returnedSession.value.startTime;//'Jan 2, 2014 11:00:00',
       session.endDateTime= endDate.toISOString();//'Jan 2, 2015 12:00:00',
       session.fromNow=null;
       session.isActive=null;
       return session;
    }
    //end of function
 //---------------------------------------------------------------------------------
     $scope.date= function()
        {
            for (var i = 0; i < $scope.dynamicSessions.length; i++) {
                $scope.dynamicSessions[i].fromNow = moment(new Date($scope.dynamicSessions.startDateTime)).fromNow();
                if (moment().isAfter($scope.dynamicSessions[i].startDateTime) && moment().isBefore($scope.dynamicSessions[i].endDateTime)) {
                    $scope.dynamicSessions[i].isActive = true;
                    $scope.dynamicSessions[i].fromNow = 'Active Now!'
                }
                else {
                    $scope.dynamicSessions[i].isActive = false;
                }
            }//end of for dynamic sessions

        }
	$scope.addUserToSession = function()
	{
		//add session path and token
		var apiPath = localStorage.basePath + 'rest/api/common/joinSession';
		var sessionToken =
        {
			"token":$scope.sessionTokenString
		}
		$http.post(apiPath,sessionToken).then(function(response){
                var userPromise=$q.defer();
                RepoService.getPerson(AuthService.getCurrentUser().loc).then(function(response){
                    var user=response.data;
                    var sessions=user.value.sessions;
                    readSessions(sessions);
                    $rootScope.toggle('addSessionOverlay', 'off');
                    //refresh the current user information
                    AuthService.refreshCurrentUser();
                    userPromise.resolve(user);
                },function(response){
                    console.log('Failed to get user data, error code: ' + response.status);
                    userPromise.reject();
                });
		}, function(response){
			console.log('Failed to add user to session, error code: ' + response.status);
		});
	}
//----------------------------------------------------------------------------
	$scope.openAddSessionOverlay = function() {
        $scope.sessionTokenString="";
		$rootScope.toggle('addSessionOverlay','on');
	}

	$scope.goToExperiment = function(experimentType){
		$state.go('experiment.' + experimentType);
	}
});
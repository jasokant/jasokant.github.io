angular.module('realm').controller('ExperimentController', ['$scope', '$rootScope', '$location', '$interval', '$timeout', 'CameraFeedService', 'RobotService', 'RepoService', '$q', '$stateParams', '$mdSidenav', '$mdDialog', function ($scope, $rootScope, $location, $interval, $timeout, CameraFeedService, RobotService, RepoService, $q, $stateParams, $mdSidenav, $mdDialog) {		
	$scope.vm = {
		gamepadconnected:false
	};

	//Entry delay for animations
	$timeout(function(){
		$('md-progress-linear').addClass('animated fadeOut');

		//Get SessionUI
		var sessionUIPromise = RepoService.getSessionUI($stateParams.sessionToken);

		sessionUIPromise.then(function(sessionUI){
			console.log('Got SessionUI Object:');
			console.log(sessionUI);

			$scope.vm.experimentUI = sessionUI;
		});
	},2000);

	$scope.menuButtonClicked = function()
    {
	  $mdSidenav('left').toggle();
    }

    $scope.$on('gamepadconnected',function(e){
    	if(!$scope.vm.gamepadconnected)
    	{
    		alert('gamepadconnected');

    		$scope.vm.gamepadconnected = true;
    	}
    });
}]);
'use strict';

angular.module('REALM').controller('TeachPointsController', ['$scope', '$rootScope', '$location', 'CameraFeedService', 'RobotService', '$q', '$http', function ($scope, $rootScope, $location, CameraFeedService, RobotService, $q, $http) {
        $scope.layoutObject = null;

        $http.get('views/layout/teachPoints.json').then(function(response){
            $scope.layoutObject = response.data;
        });

                        
    }
]);
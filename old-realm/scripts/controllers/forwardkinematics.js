'use strict';

angular.module('REALM').controller('ForwardKinematicsController', ['$scope', '$rootScope', '$location', 'CameraFeedService', 'RobotService', '$q', '$http', function ($scope, $rootScope, $location, CameraFeedService, RobotService, $q, $http) {
        $scope.layoutObject = null;

        $http.get('views/layout/forwardkinematics.json').then(function(response){
            $scope.layoutObject = response.data;
        });

                        
    }
]);
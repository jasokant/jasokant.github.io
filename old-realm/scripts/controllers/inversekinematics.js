'use strict';

angular.module('REALM').controller('InverseKinematicsController', ['$scope', '$rootScope', '$location', 'CameraFeedService', 'RobotService', '$q', '$http',
    function ($scope, $rootScope, $location, CameraFeedService, RobotService, $q, $http) {
        $scope.layoutObject = null;

        $http.get('views/layout/inversekinematics.json').then(function(response){
            $scope.layoutObject = response.data;

        });
                                                                
    }
]);
angular.module('REALM', ['ui.bootstrap']);

var sessionTokenCtrl = function ($scope, $modal, $log) {

    $scope.open = function (size) {

        var modalInstance = $modal.open({
            templateUrl: '../app/views/partials/sessionToken.html',
            controller: ModalInstanceCtrl,
            size: size,
            resolve: {}
        });
        modalInstance.result.then(
            function (name) {
                console.log(name);
            },
            function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };
};

// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $modal service used above.

var ModalInstanceCtrl = function ($scope, $modalInstance) {


    $scope.ok = function () {
        $modalInstance.close($scope.token);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
};
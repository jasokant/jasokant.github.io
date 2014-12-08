'use strict';
angular.module('realmApp').filter('unsafe', function($sce) {
    return function(val) {
        return $sce.trustAsHtml(val);
    };
});
'use strict';

realm.config(function($urlRouterProvider){
  $urlRouterProvider.otherwise('/index/login');
});

realm.run(function ($rootScope, $state, $stateParams) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
});

//Take the current URL
var currentURL = window.location.href;

//...search for index to splice on
var indexOfSpecificPath = currentURL.indexOf('app');

//splice away4
localStorage.basePath = currentURL.slice(0,indexOfSpecificPath);
//alert('BASE PATH = ' + window.basePath);

if (document.location.hostname === "localhost")
{
  localStorage.basePath = "https://realmproject.net:8443/ui/";
}


if(document.location.hostname==="localhost")
{
    localStorage.basePath="https://realmproject.net:8443/ui/";
}


'use strict';

var deps = [
  'ngMaterial',
  'ngAnimate',
  'ui.router',
  'ui.bootstrap', 
  'ui.date'
  
];

var app = angular.module('REALM', deps);

app.config(function($urlRouterProvider){
  $urlRouterProvider.otherwise('/index/login');
});

app.run(function ($rootScope, $state, $stateParams) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
});
/*app.constant('AUTH_EVENTS', {
  loginSuccess: 'auth-login-success',
  loginFailed: 'auth-login-failed',
  logoutSuccess: 'auth-logout-success',
  sessionTimeout: 'auth-session-timeout',
  notAuthenticated: 'auth-not-authenticated',
  notAuthorized: 'auth-not-authorized',
  notFound: 'auth-not-found'
});

app.constant('GAMEPAD_EVENTS', {
  gamepadConnected: 'gamepad-connected',
  gamepadDisconnected: 'gamepad-disconnected'

});

app.constant('USER_ROLES', {
  admin: 'admin',
  teacher: 'teacher',
  student: 'student',
  guest: 'guest'
});*/

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


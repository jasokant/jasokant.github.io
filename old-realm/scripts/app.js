'use strict';

var deps = [
'ui.router',
'ngTouch',
'ngCookies',
'mobile-angular-ui',
//'angular-momentum-scroll',
    //'Slidebox',
    //'ui.sortable',
    //'wijmo',
    //'angularTreeview',
    'ui.bootstrap',
    //'ngDragDrop',
    'ui.date',
    'cfp.hotkeys',
    ];

    var app = angular.module('REALM', deps);

    app.config(function ($stateProvider, $urlRouterProvider, $httpProvider) {

  //Define URL/template/controller for each state
  $stateProvider
  .state('login', {url:'/login', templateUrl: 'views/login.html', controller: 'LoginController', data: {authorizedRoles:['guest']}})
  .state('signup', {url: '/signup', templateUrl: 'views/signup.html', controller: 'SignupController', data: {authorizedRoles:['guest']}})

  .state('studentHome',{url: '/studentHome', templateUrl: 'views/studentHome.html', controller: 'StudentHomeController', data: {authorizedRoles:['student']}})
  .state('studentSessions',{url: '/studentSessions', templateUrl: 'views/studentSessions.html', controller: 'StudentSessionsController', data: {authorizedRoles:['student']}})
  .state('studentProfile',{url: '/studentProfile', templateUrl: 'views/studentProfile.html', controller: 'StudentProfileController', data: {authorizedRoles:['student']}})
  .state('studentCourses',{url: '/studentCourses', templateUrl: 'views/studentCourses.html', controller: 'StudentCoursesController', data: {authorizedRoles:['student']}})

  .state('teacherHome',{url: '/signup', templateUrl: 'views/signup.html', controller: 'SignupController', data: {authorizedRoles:['guest']}})
  .state('teacherCourses',{url: '/signup', templateUrl: 'views/signup.html', controller: 'SignupController', data: {authorizedRoles:['guest']}})
  .state('teacherAssignments',{url: '/signup', templateUrl: 'views/signup.html', controller: 'SignupController', data: {authorizedRoles:['guest']}})
  .state('teacherSessions',{url: '/teacherSessions', templateUrl: 'views/teacherSessions.html', controller: 'TeacherSessionsController', data: {authorizedRoles:['teacher']}})
  .state('teacherStudents',{url: '/signup', templateUrl: 'views/signup.html', controller: 'SignupController', data: {authorizedRoles:['guest']}})
  .state('teacherProfile',{url: '/signup', templateUrl: 'views/signup.html', controller: 'SignupController', data: {authorizedRoles:['guest']}})
  .state('adminHome',{url: '/signup', templateUrl: 'views/signup.html', controller: 'SignupController', data: {authorizedRoles:['guest']}})

  .state('notifications',{url: '/signup', templateUrl: 'views/signup.html', controller: 'SignupController', data: {authorizedRoles:['guest']}})

  .state('experiment',{url: '/experiment', templateUrl: 'views/experiment.html', controller: 'ExperimentController', data: {authorizedRoles:['student']}})
  .state('experiment.forwardKinematics',{url: '/forwardKinematics', templateUrl: 'views/experiments/forwardkinematics.html', controller: 'ForwardKinematicsController', data: {authorizedRoles:['student']}})
  .state('experiment.inverseKinematics',{url: '/inverseKinematics', templateUrl: 'views/experiments/inversekinematics.html', controller: 'InverseKinematicsController', data: {authorizedRoles:['student']}})
  .state('experiment.dynamicResponse',{url: '/dynamicResponse', templateUrl: 'views/experiments/dynamicresponse.html', controller: 'DynamicResponseController', data: {authorizedRoles:['student']}})
  .state('experiment.teachPoints',{url: '/teachPoints', templateUrl: 'views/experiments/teachpoints.html', controller: 'TeachPointsController', data: {authorizedRoles:['student']}});
  //Redirect to login state if URL does not correspond to a defined state
  $urlRouterProvider
  .otherwise('/login');
});


app.run(function ($rootScope, AUTH_EVENTS, AuthService) {
  $rootScope.$on('$stateChangeStart', function (event, next) {
    var authorizedRoles = next.data.authorizedRoles;
    if(next.url == '/login' || next.url == '/signup' || next.url == '/studentHome'){
        //No need to authorize, anyone can access
      }
      else if(!AuthService.isAuthorized(authorizedRoles)) {
        event.preventDefault();
        if (AuthService.isAuthenticated()) {
        // user is not allowed
        $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
      } else {
        // user is not logged in
        $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
      }
    }
  });
});

app.constant('AUTH_EVENTS', {
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


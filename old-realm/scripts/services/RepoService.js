'use strict';

angular.module('REALM')
    .service('RepoService',function($http, $q, AuthService, AUTH_EVENTS) {

//-----------------------------------------------------------
        //give a user returns an array of sessions
        this.getSessionsFromUser=function(){
           return AuthService.getCurrentUser().value.sessions;
        }
//-----------------------------------------------------------
        //given a session location, return the session json
        this.getSession = function(sessionLocation){
            var session = $q.defer();
            var sessionPath = localStorage.basePath + 'rest/repo/Session/' + sessionLocation + ".json";
            $http.get(sessionPath).then(function(response){
                var sessionInfo=response;
                session.resolve(sessionInfo);
            }, function(response){
                console.log('Failed to get session info, error code:');
                console.log(response.status);
                session.reject(response.status);
            });
            return session.promise;
        };
//-------------------------------------------------------------------
        //given a session location, return the session json
        this.getPerson = function(personLocation){
            var person = $q.defer();
            var personPath = localStorage.basePath + 'rest/repo/Person/' + personLocation + ".json";
            $http.get(personPath).then(function(response){
                var personInfo=response;
                person.resolve(personInfo);
            }, function(response){
                console.log('Failed to get person info, error code:');
                console.log(response.status);
                person.reject(response.status);
            });
            return person.promise;
        };
    });
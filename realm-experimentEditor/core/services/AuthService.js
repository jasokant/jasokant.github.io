'use strict';

angular.module('REALM')
    .service('AuthService', function($http, $q, $timeout, $rootScope, RepoService){

        //reference to AuthService
        var that = this;       

        var serverDown = true;

        //urls
        var loginPath = 'rest/login';
        var signupPath = 'rest/signup';

        //Login via REST, sets JSESSIONID cookie for API access, then returns person object and saves user location in localStorage
        if(!serverDown)
        {
        	this.login = function(credentials) {
        		
        		var deferred = $q.defer();
        			
                //Call REALM Login API
                $http.post(localStorage.basePath + loginPath,{"username": credentials.email, "password": credentials.password}, {withCredentials:true})
                    .then(function(response){
                        
                        console.log("Login Response: ");
                        console.log(response);

                        $timeout(function() {
                                
                            var allCookies = document.cookie;
                            console.log("Cookies: ");
                            console.log(allCookies);


                            //When login is successful, deferred.promise is resolved with value = person object returned from login API
                            if(response.status == 200)
                            {
                                var personObject = response.data;
                                localStorage.currentUser = personObject.loc;
                                deferred.resolve(personObject);
                            }
                            
                            //When login fails, deferred.promise is rejected with reason = status code returned from login server
                            else
                            {
                                deferred.reject(response.status);
                            }
                        });

                    }, function(response) {
                        
                        console.log('login fail error: ' + response.status)
                        deferred.reject(response.status);
                        
                    });

        		return deferred.promise;
        	}

            this.signup = function(accountDetails) {
                var deferred = $q.defer();
                
                //Call REALM Signup API
                $http.post(localStorage.basePath + signupPath, {email: accountDetails.email, password: accountDetails.password, fullName: accountDetails.name}).then(function(response){
                    console.log(response);
                    deferred.resolve();
                },function(response){
                    console.log(response);
                    deferred.reject(response.status)
                });

                return deferred.promise;
            }

            this.isAuthenticated = function() {
                var authenticated = $q.defer();

                RepoService.getPerson(localStorage.currentUser).then(function(response){
                    //user is authenticated
                    console.log('user is authenticated');
                    authenticated.resolve(true)
                },function(response){
                    //user is not authenticated
                    console.log('user is not authenticated');
                    authenticated.resolve(false);
                });

                return authenticated.promise;
            }

            this.logout = function() {
                localStorage.currentUser = null;

                $state.go('index.login');
            }

            this.isAuthorized = function(route) {
                var authorized = $q.defer();

                
                return authorized.promise;
            }
        }

        //Signup via REST, 
        else if(serverDown)
        {
            
            this.login = function(credentials) {
                var deferred = $q.defer();

                var person = {
                    name: "student",
                    email: "student@uwo.ca", 
                    role: "student", 
                    sessions: ['Session-1','Session-2','Session-3'],
                    courses: {
                        enrolled: ['Course-1','Course-2','Course-3'],
                        pending: ['Course-4','Coursed-5','Course-6']
                    }
                }

                deferred.resolve(person);

                return deferred.promise;
            }

            this.signup = function(accountDetails) {
                var deferred = $q.defer();

                deferred.resolve();

                return deferred.promise;
            }

            //Check whether user is authenticated by accessing API. If it throws a fit, session is expired or user never logged in.
            this.isAuthenticated = function() {
                var deferred = $q.defer();

                deferred.resolve(true);

                return deferred.promise;
            }
        
            this.logout = function() {
                $state.go('index.login');            
            }
        
            this.isAuthorized = function(route) {
                var authorized = $q.defer();

                
                return authorized.promise;
            }
        }
    });

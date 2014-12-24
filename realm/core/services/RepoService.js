'use strict';

realm_services.service('RepoService',function($http, $q) {

        var that = this;

        var serverDown = true;

        this.test = function() {
            return 'asdf'
        }

        if(!serverDown)
        {
            //returns promise to an object from the repo
            this.getObject = function(objectType, objectLocation) {
                var object = $q.defer();
                
                var objectPath = localStorage.basePath + 'rest/repo/' + objectType + '/' + objectLocation + ".json";
                $http.get(objectPath).then(function(response){
                    object.resolve(response.data);
                }, function(response){
                    console.log('Failed to get ' + objectLocation +', error code:');
                    console.log(response.status);
                    object.reject(response.status);
                });
                
                return object.promise;
            }

            //returns array of objects (not promises!)
            /*this.getObjectsFromLocationArray = function(objectType,locationArray)
            {
                var objectArray = [];
                
                var deferred = $q.defer();

                locationArray.forEach(function(element,index,array){
                    that.getObject(objectType, element).then(function(repoObject){
                        objectArray[index].push(repoObject);
                    }, function(errorCode){
                        console.log(errorCode);
                    });
                });

                deferred.resolve(objectArray);
            } */

            // returns a no-frills person object promise
            this.getPerson = function(personLocation) {
                var person = $q.defer();

                that.getObject('Person', personLocation).then(function(repoPerson){
                    var simpleSessions = [];
                    repoPerson.value.sessions.value.forEach(function(element, index, array){
                        sessions.push(element.loc);
                    });

                    var pendingCourses = [];
                    repoPerson.value.pendingCourses.forEach(function(element, index, array){
                        pendingCourses.push(element.loc);
                    });

                    var enrolledCourses = [];
                    repoPerson.value.enrolledCourses.forEach(function(element, index, array){
                        pendingCourses.push(element.loc);
                    });
                    
                    var simplePerson = {
                        name: repoPerson.value.name,
                        email: repoPerson.value.email,
                        role: '',
                        sessions: simpleSessions,
                        courses: {
                            enrolled:enrolledCourses,
                            pending: pendingCourses
                        }
                    }

                    that.getObject('Role', repoPerson.role.loc).then(function(role){
                        simplePerson.role = role;

                        person.resolve(simplePerson);

                    }, function(errorCode){
                        console.log('Failed to get role, errorCode' + error);
                    });

                },function(errorCode){
                    person.reject(errorCode);
                    console.log('Failed to get person. errorCode' + errorCode);
                });

                return person.promise;
            }

            // returns a no-frills session object promise
            this.getSession = function(sessionLocation) {
                var session = $q.defer();

                that.getObject('Session', sessionLocation).then(function(repoSession){
                    
                    var simpleSession = {
                        assignment: repoSession.value.assignment.loc,
                        sessionToken: repoSession.value.sessionToken,
                        devices: Object.keys(repoSession.value.devices.value)
                    }

                    session.resolve(simpleSession);

                },function(errorCode){
                    session.reject(errorCode);
                    console.log('Failed to get session. errorCode' + errorCode);
                });

                return session.promise;
            }   

            // returns a no-frills course object promise
            this.getCourse = function(courseLocation) {
                var course = $q.defer();

                that.getObject('Course', courseLocation).then(function(repoCourse){
                    var simpleTeachers = [];
                    repoCourse.value.teachers.forEach(function(element, index, array){
                        simpleTeachers.push(element.loc);
                    });
                    var simpleCourse = {
                        name: repoCourse.value.name,
                        teachers: [],
                        description: repoCourse.value.description,
                        startDate: moment(repoCourse.value.startDate),
                        endDate: moment(repoCourse.value.startDate)
                    }
                },function(errorCode){
                    course.reject(errorCode);
                    console.log('Failed to get course. errorCode' + errorCode);
                });
            }
        }
        else if(serverDown)
        {
            this.getObject = function(objectType, objectLocation) {
                
            }

            this.getPerson = function(personLocation) {
                var deferred = $q.defer();

                var person = {
                        name: repoPerson.value.name,
                        email: repoPerson.value.email,
                        role: '',
                        sessions: simpleSessions,
                        courses: {
                            enrolled:enrolledCourses,
                            pending: pendingCourses
                        }
                    }

                deferred.resolve(person);

                return deferred.promise;
            }

            this.getSession = function(sessionLocation) {

            }
            
            this.getSessionUI = function(sessionLocation) {
                var sessionUI = $q.defer();
                
                var mockResponse = {
                    components : [
                        {
                            'type':'cameraFeedComponent',
                            'heading':'Camera',
                            'url':'rest/device/camera',
                            'layout':{
                                "flex-lg":"33",
                                "offset-lg":"0",
                                "flex-md":"50",
                                "offset-md":"25"
                            },
                            'options':{

                            }
                        },
                        {
                            'type':'angleInputComponent',
                            'heading':'Angle Input',
                            'url':'rest/device/mico',
                            'layout':{
                                "flex-lg":"33",
                                "flex-md":"60"
                            },
                            'options':{

                            }
                        },
                        {
                            'type':'joystickInputComponent',
                            'heading':'Joysticks',
                            'url':'rest/device/mico',
                            'layout': {
                                "flex-lg":"33",
                                "flex-md":"40"
                            },
                            'options': {
                                axesEnabled: [true,true,true,true]
                            }   
                        },
                        {
                            'type':'angleStateComponent',
                            'heading':'Angle State',
                            'url':'rest/device/mico',
                            'layout':{

                            },
                            'options': {

                            }
                        },
                        {
                            'type':'poseStateComponent',
                            'heading':'Pose State',
                            'url':'rest/device/mico',
                            'layout':{

                            },
                            'options':{
                                
                            }
                        }
                    ]
                }
                
                sessionUI.resolve(mockResponse);

                return sessionUI.promise;
            }

            this.getCourse = function(courseLocation) {

            }
        }
    });
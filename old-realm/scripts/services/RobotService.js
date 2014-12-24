'use strict';

angular.module('REALM')
    .service('RobotService',function($http, $q){         
        
        var that = this;
        var serverDown = true;

        /*********HELPER FUNCTIONS***********/
        this.hashToArray = function(object) {
            var returnArray = [];

            for (var key in object) {
                returnArray.push(object[key]);
            }

            return returnArray;
        }

        /********ROBOT API***********/
            
            /*************JOYSTICK**********/

            this.move = function(moveDeviceCallback, devicePath, x1, y1, x2, y2) {
                moveDeviceCallback(devicePath,x1,y1,x2,y2);
            }

            this.moveMico = function(devicePath,x1,y1,x2,y2) {
                console.log('moveMico(' +  x1 + ',' + y1 + ',' +  x2 + ',' + y2 + ') -----> twist: {"linear": { x":' + x1 + ',"y": ' + y1 + ',"z": ' + y2 + '} "angular":{"x":0,"y":0,"z":0} }');

                var postData = {
                    'action': "move",
                    'arguments': {
                        'linear': {
                            'x':x1,
                            'y':y1,
                            'z':y2
                        },
                        'angular': {
                            x:0,
                            y:0,
                            z:0
                        }
                    }
                };

                $http.post(localStorage.basePath + devicePath, postData).then(function(response){
                    console.log('Sent joystick input to ' + devicePath + ' successfully');
                }, function(response){
                    console.log('Could not send joystick input to ' + devicePath + '. Error Code: ' + response.status);
                });
            }

            this.moveHusky = function(devicePath,x1,y1,x2,y2) {
                console.log('moveHusky(' +  x1 + ',' + y1 + ',' +  x2 + ',' + y2 + ') -----> twist: {"linear": { x":' + (x1/2) + ',"y":0,"z":0} "angular":{"x":0,"y":0,"z":' + (y2/2) + '} }');
                
                var postData = {
                    'action': "move",
                    'arguments': {
                        'linear': {
                            'x':(x1/2),
                            'y':0,
                            'z':0
                        },
                        'angular': {
                            x:0,
                            y:0,
                            z:(y2/2)
                        }
                    }
                };

                $http.post(localStorage.basePath + devicePath, postData).then(function(response){
                    console.log('Sent joystick input to ' + devicePath + ' successfully');
                }, function(response){
                    console.log('Could not send joystick input to ' + devicePath + '. Error Code: ' + response.status);
                });
            }

            /**************GETTERS**************/
            this.getJoints = function(devicePath){
                var angleSet = $q.defer();
                
                if(!serverDown)
                {
                    $http.get(localStorage.basePath + devicePath).then(function(response){

                        var jointData = {
                            degrees: that.hashToArray(response.data.joints),
                            radians: response.data.jointState.position
                        }
                        
                        angleSet.resolve(jointData);
                    
                    }, function(response){
                        console.log('Failed to get joint angles, error code:');
                        console.log(response.status);

                        angleSet.reject(response.status);
                    });
                } else {
                    var jointData = {
                        radians:[1.01,1.02,1.03,1.04,1.05,1.06]
                    }
                    angleSet.resolve(jointData);
                }
                
                return angleSet.promise;
            };

            this.getPose = function(devicePath) {
                var pose = $q.defer();

                $http.get(localStorage.basePath + devicePath).then(function(response){
                    //console.log(response.data);
                    var poseData = {
                        position:response.data.position.linear,
                        orientation:response.data.position.angular

                       //position:response.data.pose.position,
                       //orientation:response.data.pose.orientation
                    }

                    pose.resolve(poseData);
                },function(response){
                    console.log('Failed to get pose, error: ' + response.status);
                    pose.reject(response.status);
                });

                return pose.promise;
            };

            /****************SENDING ROBOT HOME*******************/
           /* this.goHome=function(devicePath)
            {
                $http.get(localStorage.basePath+devicePath).then(function(response) {

                },function(response)
                {
                    console.log('Failed to send home: '+response.status);
                });
            };*/
            /****************CURRENT STATUS ROBOT*****************/
            this.getMode = function(devicePath) {
                var robotMode = $q.defer();
                $http.get(localStorage.basePath + devicePath).then(function(response){
                  //  console.log(response.data);
                    var mode = response.data.device.mode;
                    robotMode.resolve(mode);
                },function(response){
                    console.log('Failed to get pose, error: ' + response.status);
                    robotMode.reject(response.status);
                });
                return robotMode.promise;
            };



            /********************SETTERS********************/
            this.setJoints = function(devicePath, jointAnglesArray){
                var postData = {
                    "action": "setJoints",
                    "arguments": {
                        
                    }
                }

                for(var i=0; i<jointAnglesArray.length; i++)
                {
                    postData.arguments['Angle_J' + (i+1)] = jointAnglesArray[i];
                };

                console.log('Set Joints POST object:')
                console.log(postData);
                $http.post(localStorage.basePath + devicePath,postData).then(function(response){
                    console.log('Sent robot setJoints command successfully');
                },function(response){
                    console.log('Failed to send robot setJoints command, error: ' + response.status);
                });
            }

            this.setPose = function(devicePath, twist) {
                $http.post(localStorage.basePath + devicePath, twist).then(function(){
                    console.log('Sent the following pose to arm successfully:');
                    console.log(twist);
                    //console.log('Sent robot setPose command successfully')
                },function(){
                    //if(response.status=="429") {
                        that.setPose(devicePath,twist);
                        //console.log('Failed to send robot setPose command, error: ' + response);
                    //}
                });
            }

            this.goHome = function(devicePath){
                var postData = {
                    "action": "home"
                };

                $http.post(localStorage.basePath + devicePath,postData).then(function(response){
                    console.log('Sent robot to home position successfully');
                },function(response){
                    console.log('Failed to send robot to home position, error: ' + response.status);
                });
            }
    });
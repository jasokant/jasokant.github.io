'use strict';

angular.module('REALM')
    .service('RobotService',function($http, $q){         
        
        var that = this;

        /*********HELPER FUNCTIONS***********/
        this.hashToArray = function(object) {
            var returnArray = [];

            for (var key in object) {
                returnArray.push(object[key]);
            }

            return returnArray;
        }

        /********ROBOT API***********/


            /**************GETTERS**************/
            this.getJoints = function(devicePath){
                var angleSet = $q.defer();
                
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
            //JOYSTICK
            this.move = function(devicePath,x,y,z) {
                z = z*-1;

                var postData = {
                    'action': "move",
                    'arguments': {
                        'linear': {
                            'x':x,
                            'y':y,
                            'z':z
                        },
                        'angular': {
                            x:0,
                            y:0,
                            z:0
                        }
                    }
                };
                //console.log(postData);
               // console.log("robot service: "+ 'x: ' +  x +  " y: " +  y + " z: " + z);
                $http.post(localStorage.basePath + devicePath, postData).then(function(response){
                    console.log("Performed 'move' action on robot successfully for "+ "x: " +  x +  " y: " +  y + " z: " + z);
                },function(response){
                    console.log("Robot 'move' action failed, error code for: "+"x: " +  x +  " y: " +  y + " z: " + z);
                    if(x==0 && y==0 && z==0)
                    {
                        that.move(devicePath,0,0,0);
                    }
                });

                //console.log('MOVE x:' + x + ' y: ' + y + ' z: ' + z);
            }

    });
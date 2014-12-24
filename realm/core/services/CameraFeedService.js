'use strict';

realm_services.service('CameraFeedService',function($http, $q, $location){
        
        var that = this;
        var serverDown = true;
        
        var imageWidth = 600;
        var imageHeight = 450;

        this.getCurrentFrame = function(cameraPath){
            var src = $q.defer();
            
            if(!serverDown)
            {
                $http.get(localStorage.basePath + cameraPath).then(function(response){
                    
                    if(angular.isDefined(response.data.image) && response.data.image !== null)
                    {
                        src.resolve("data:image/png;base64," + response.data.image);
                    }
                    else
                    {
                        src.reject("problem loading image");
                    }
                },function(response){
                    console.log('Failed to load camera feed image, error code:');
                    console.log(response.status);
                });
            } else {
                src.resolve('data:image/gif;base64,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');
            }

            return src.promise;
        }

        this.setSize = function(cameraPath, width, height){
            
            var deferred = $q.defer();

            var postData = {
                "action":"setSize",
                "arguments":{
                    "width":width,
                    "height":height
                }
            };

            $http.post(localStorage.basePath + cameraPath, postData).then(function(response){
                deferred.resolve();
            }, function(response){
                deferred.reject();
            });

            return deferred.promise;
        };

        this.setQuality = function(cameraPath, quality)
        {
            var deferred = $q.defer();

            if(quality > 1.0 || quality < 0)
            {
                console.log('Invalid Quality Value, must be between 0 - 1.0');
                deferred.reject('Invalid quality value');
            }

            var postData = {
                "action":"setQuality",
                "arguments":{
                    "quality": quality
                }
            }

            $http.post(localStorage.basePath + cameraPath, postData).then(function(response){
                deferred.resolve();
            },function(response){
                deferred.reject();
            });

            return deferred.promise;
        }
    });
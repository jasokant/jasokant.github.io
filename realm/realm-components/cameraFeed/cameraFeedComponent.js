'use strict';

realm_components.directive('cameraFeedComponent' , function($timeout, $http, $q, CameraFeedService) {
        return {
            restrict: 'E',
            replace: false,
            scope: true,
            template: "<div class='camera-feed-component__container'>" +
                          "<canvas class='camera-feed-component__canvas'>" + 
                          "</canvas>" +
                          "<div content-for='component-card__toolbar-button-container'><md-button class='component-card__toolbar-button fullscreen-button' ng-click='toggleFullscreen()'><i class='mdi mdi-fullscreen'></i><md-tooltip>Toggle Fullscreen</md-tooltip></md-button></div>" + 
                      "</div>",
            controller: function CameraFeedComponentController($scope, $element, $attrs)
            {
                var cameraPath = $scope.component.url;
                
                var canvasContainer = $($element).find('.camera-feed-component__container');
                var canvasContext = $($element).find('.camera-feed-component__canvas')[0].getContext('2d');

                var fullscreen = false;
                
                var imgData;
                var img = new Image();
                
                var renderVideo = function(){
                    var promise = CameraFeedService.getCurrentFrame(cameraPath);
                    promise.then(function(message){
                        imgData = message;
                        img.src = imgData;

                        // h / w
                        var imageAspectRatio = img.height.toFixed(2) / img.width.toFixed(2);
                        // h / w
                        var containerAspectRatio = canvasContainer.height().toFixed(2) / canvasContainer.width().toFixed(2);

                        // useful for computing width when height is bound
                        var invertedImageAspectRatio = 1.00 / imageAspectRatio;

                        


                        if(!fullscreen)
                        {
                            //When component is not fullscreen, image dimensions are width-bound
                            
                            //set canvas width to container width
                            canvasContext.canvas.width = canvasContainer.width();
                            
                            //compute height based on image aspect ratio and canvas width
                            var computedHeight = imageAspectRatio * canvasContext.canvas.width;

                            //set canvas height
                            canvasContext.canvas.height = computedHeight;

                            //set container height
                            canvasContainer.height(computedHeight);
                            
                            //draw image on canvas
                            canvasContext.drawImage(img,0,0,canvasContainer.width(),computedHeight);
                            
                        } else {
                            //set container height to match its parent
                            canvasContainer.css("height","calc(100vh - 104px)");

                            // set canvas dimensions to container dimensions
                            canvasContext.canvas.height = canvasContainer.height();
                            canvasContext.canvas.width = canvasContainer.width();

                            //When component is fullscreen, image dimensions may be either width or height bound

                            //if image aspect ratio < container aspect ratio, then image dimensions are height bound
                            //  else image dimensions are width bound
                            if(imageAspectRatio > containerAspectRatio) {
                                // compute width based on image aspect ratio and canvas height 
                                var computedWidth = invertedImageAspectRatio * canvasContext.canvas.height;

                                //compute margin needed to centre image horizontally (empty space / 2)
                                var emptySpace = canvasContainer.width().toFixed(2) - computedWidth;
                                var marginLeft = emptySpace / 2;

                                //draw image on canvas (centred horizontally)
                                canvasContext.drawImage(img,marginLeft,0,computedWidth,canvasContainer.height());
                            } else {
                                //compute height based on image aspect ratio and canvas width
                                var computedHeight = imageAspectRatio * canvasContext.canvas.width;

                                //compute margin needed to centre image vertically (empty space / 2)
                                var emptySpace = canvasContainer.height().toFixed(2) - computedHeight;
                                var marginTop = emptySpace / 2;

                                //draw image on canvas (centred vertically)
                                canvasContext.drawImage(img,0,marginTop,canvasContainer.width(),computedHeight);
                            } 
                        }

                        setTimeout(renderVideo,30);
                    },function(response){
                        console.log('Failed to get camera feed image, error code: ');
                        console.log(response.status);
                        setTimeout(renderVideo,30);  
                    });
                }

                renderVideo();

                $scope.toggleFullscreen = function(){
                    fullscreen = !fullscreen;
                    $('.component-card').has('joystick-input-component').toggleClass('component-card--joystick-fullscreen');
                    $($element).parent().parent().parent().parent().toggleClass('component-card--camera-fullscreen');
                }
            },
            compile: function CompilingFunction(tElement, tAttrs)
            {
                //can only manipulate DOM here (can't access scope yet)
                //tElement.replaceWith(this.template);
                
                return function LinkingFunction(scope, element, attrs, parentController) {
                }
            }
        }
    });
    




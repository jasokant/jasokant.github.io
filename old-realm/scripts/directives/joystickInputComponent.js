'use strict';

var ctrl;

angular.module('REALM').directive('joystickInputComponent', ['RobotService', function(RobotService) {
  return {
    restrict: 'E',
    replace: false,
    template:
        "<div class='joystick-input-component__labels'>"+
            "<span class='joystick-input-component__label'> X, Y:" +
            "<span class='glyphicon glyphicon-info-sign' ng-controller='joystickModalCtrl' ng-click='open(xyLabel)' ></span>"+
            "</span>"+
            "<span class='joystick-input-component__label'>Z:"+
            "<span class='glyphicon glyphicon-info-sign' ng-controller='joystickModalCtrl' ng-click='open(zLabel)' ></span>"+
            "</span> "+
        "</div>"+

        "<div class='joystick-input-component__container'>" +
                        "<joystick stick='1'></joystick>" +
                        "<joystick stick='2'></joystick>" +
        "</div>"+
            "<div class='joystick-input-component__buttons'>"+
                 "<button class='btn btn-primary' ng-click='goHome()'>Go Home</button>" +
            "</div>",

    compile: function CompilingFunction(tElement, tAttrs)
    {
      //can only manipulate DOM here (can't access scope yet)
      
      return function LinkingFunction(scope, element, attrs, ctrl)
      {     
            function joystickDown() {
              console.log('********down*******');

              ctrl.moveRobot(j1.getX(),(j1.getY() * -1),j2.getX(),(j2.getY() * -1));
            }

            function joystickMove() {
              console.log('*******move*******');

              ctrl.moveRobot(j1.getX(),(j1.getY() * -1),j2.getX(),(j2.getY() * -1));
            }

            function joystickUp() {
              console.log('********up*******');

              ctrl.moveRobot(j1.getX(),(j1.getY() * -1),j2.getX(),(j2.getY() * -1));
            }

            var stickMovedThreshold = 0.2;
            var j1;
            var j2;
            var gamepad;            

            var isLeftJoystickZeroed = true;
            var isRightJoystickZeroed = true;


            window.addEventListener('gamepadconnected', function(e){
              alert('gamepad connected, index: ' + e.gamepad.index);

              if(gamepad === undefined)
                gamepad = navigator.getGamepads()[e.gamepad.index];
            });

            var deadMan = false;

            function runAnimation() {
              
              window.requestAnimationFrame(runAnimation);

              deadMan = false;

              if(j1 === undefined || j2 === undefined)
              {
                j1 = window.joysticks[0];
                j2 = window.joysticks[1];

                $(element).mousedown(function(){
                  joystickDown();
                });

                $(element).mousemove(function(){
                  if(j1._pressed || j2._pressed)
                    joystickMove();
                });

                $(element).mouseup(function(){
                  joystickUp();
                });

                $(element).mouseleave(function(){
                  if(j1._pressed || j2._pressed) {
                    j1._onUp();
                    j2._onUp();

                    joystickUp();
                  }
                });
              }

              if(j1 !== undefined && j2 !== undefined)
              {
                if(j1._pressed || j2._pressed)
                {
                  scope.$emit('VIRTUAL-JOYSTICK-MOVED');
                }
              }
              

              //If gamepad and virtual joysticks exist
                //get axis values
                //check if they're above threshold
                  //yes = 
              if(gamepad !== undefined)
              {
                deadMan = gamepad.buttons[6].pressed;
                if(deadMan)
                {
                  alert('Deadman activated.');
                }

                var x1 = gamepad.axes[0];
                var y1 = gamepad.axes[1];
                
                var x2 = gamepad.axes[2];
                var y2 = gamepad.axes[3];

                var leftJoystickPastThreshold = Math.abs(x1) > stickMovedThreshold || Math.abs(y1) > stickMovedThreshold;
                var rightJoystickPastThreshold = Math.abs(x2) > stickMovedThreshold || Math.abs(y2) > stickMovedThreshold;

                if(leftJoystickPastThreshold && j1._pressed === false && deadMan)
                {
                  isLeftJoystickZeroed = false;
                  
                  var offset = $(j1._container).offset();

                  j1._pressed = true;
                  j1._stickEl.style.display="";
                  j1._onMove(offset.left + 100 + (x1*j1._stickRadius), offset.top + 100 + (y1*j1._stickRadius));
                  
                  joystickDown();
                  
                  j1._pressed = false;
                } else if(!isLeftJoystickZeroed) {
                  isLeftJoystickZeroed = true;

                  j1._onUp();
                  joystickUp();
                }

                if(rightJoystickPastThreshold && j2._pressed === false && deadMan)
                {
                  isRightJoystickZeroed = false;
                  
                  var offset = $(j2._container).offset();

                  j2._pressed = true;
                  j2._stickEl.style.display="";
                  j2._onMove(offset.left + 100 + (x2*j2._stickRadius), offset.top + 100 + (y2*j2._stickRadius));
                  
                  joystickDown();

                  j2._pressed = false;
                } else if(!isRightJoystickZeroed) {
                  isRightJoystickZeroed = true;
                  
                  j2._onUp();
                  joystickUp();
                }
              }
            } 

            window.requestAnimationFrame(runAnimation);
        
      }
    },
    controller: function ControllerFunction($scope, $element, $attrs)
    {
        var ctrl = this;
        var robotPath = $scope.component.componentOptions.url;
        var robotPathSplitStringArray = robotPath.split('/');
        var robotType = robotPathSplitStringArray[robotPathSplitStringArray.length - 1];

        console.log('Robot Type: ' + robotType);
        
        $scope.xyLabel="X, Y:";
        $scope.zLabel="Z:";
        
        this.moveRobot = function(x1, y1, x2, y2){
          console.log('Joystick 1: (' +  x1 + ',' + y1 + ')');
          console.log('Joystick 2: (' +  x2 + ',' + y2 + ')');

          switch(robotType)
          {
            case 'mico':
              RobotService.move(RobotService.moveMico, robotPath, x1, y1, x2, y2);
              break;

            case 'husky':
              RobotService.move(RobotService.moveHusky, robotPath, x1, y1, x2, y2)
              break;

            default:
              'invalid robot type'
          }
        }

        $scope.goHome=function()
        {
            RobotService.goHome(robotPath);
        }
    }    
  }
}])
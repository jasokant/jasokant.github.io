'use strict';

var ctrl;

joystickInputComponentModule.directive('joystickInputComponent', ['RobotService', '$mdDialog', function(RobotService, $mdDialog) {
  return {
    restrict: 'E',
    replace: false,
    template:"<div class='joystick-input-component__container'>" +
                "<joystick stick='1'></joystick>" +
                "<joystick stick='2'></joystick>" +
                "<h1 class='joystick-1-data'>({{vm.j1.x}},{{vm.j1.y}})</h1>" +
                "<h1 class='joystick-2-data'>({{vm.j2.x}},{{vm.j2.y}})</h1>" +
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
            var gamepadIndex;            

            var isLeftJoystickZeroed = true;
            var isRightJoystickZeroed = true;


            window.addEventListener('gamepadconnected', function(e){
              

              if(gamepadIndex === undefined)
              {
                $mdDialog.show({
                  templateUrl:'realm-components/joystickInput/partials/joystickInput.gamepadConnectedDialog.tpl.html',
                  controller:'gamepadConnectedDialogController'
                })
                gamepadIndex = e.gamepad.index;
              }
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
              

             
              if(gamepadIndex !== undefined)
              {
                var gamepad = navigator.getGamepads()[gamepadIndex];

                deadMan = gamepad.buttons[7].pressed;
                if(deadMan)
                {
                  console.log('Deadman activated.');
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
                  j1._onMove(offset.left + 72 + (x1*j1._stickRadius), offset.top + 72 + (y1*j1._stickRadius));
                  
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
                  j2._onMove(offset.left + 72 + (x2*j2._stickRadius), offset.top + 72 + (y2*j2._stickRadius));
                  
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

        $scope.vm = 
        {
          j1: 
          {
            x:'0.00',
            y:'0.00'
          },
          j2: 
          {
            x:'0.00',
            y:'0.00'
          }
        }

        var robotPath = $scope.component.url;
        var robotPathSplitStringArray = robotPath.split('/');
        var robotType = robotPathSplitStringArray[robotPathSplitStringArray.length - 1];

        console.log('Robot Type: ' + robotType);
        
        this.moveRobot = function(x1, y1, x2, y2){
          console.log('Joystick 1: (' +  x1 + ',' + y1 + ')');
          console.log('Joystick 2: (' +  x2 + ',' + y2 + ')');

          var j1DataString = '(' + x1.toFixed(2) + ',' + y1.toFixed(2) + ')';
          $('.joystick-1-data').text(j1DataString);

          var j2DataString = '(' + x2.toFixed(2) + ',' + y2.toFixed(2) + ')';
          $('.joystick-2-data').text(j2DataString);

          switch(robotType)
          {
            case 'mico':
              //RobotService.move(RobotService.moveMico, robotPath, x1, y1, x2, y2);
              break;

            case 'husky':
              //RobotService.move(RobotService.moveHusky, robotPath, x1, y1, x2, y2)
              break;

            default:
              'invalid robot type'
          }
        }

        $scope.goHome=function()
        {
            //RobotService.goHome(robotPath);
        }
    }    
  }
}])
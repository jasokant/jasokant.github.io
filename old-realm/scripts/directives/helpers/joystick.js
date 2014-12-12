'use strict';

angular.module('REALM').directive('joystick', function() {
  return {
    restrict: 'E',
    replace: false,
    require:'^joystickInputComponent',
    scope: {
        stick:'='
    },
    template: '<div class="joystick__container">' +
              '</div>', 
    compile: function CompilingFunction(tElement, tAttrs)
    {
      //can only manipulate DOM here (can't access scope yet)
      
      return function LinkingFunction(scope, element, attrs, parentCtrl) {
        
        
      }
    },
    controller: function ControllerFunction($scope, $element, $attrs)
    {
        //Init Joystick
        var containerElement = $($element).find('.joystick__container');
        var joystick = new VirtualJoystick({
          container: containerElement[0],
          mouseSupport:true,
          stationaryBase:true,
          baseX:100,
          baseY:100,
          limitStickTravel:true,
          stickRadius:50,
          allowX: $scope.$parent.component.componentOptions.axesEnabled[2*$scope.stick - 2],
          allowY: $scope.$parent.component.componentOptions.axesEnabled[2*$scope.stick - 1],
          strokeStyle:"#007aff"

        });

        if(window.joysticks === undefined)
          window.joysticks = [];

        window.joysticks.push(joystick);
        var stickMovedThreshold = 0.2;
    }
  }
})
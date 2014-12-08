'use strict'

app.directive('numericInput', function () {
    return    {
        restrict: 'E',
        replace: true,

        scope: {
            min: '=',
            max: '=',
            step: '=',
            value: '='
        },
        template: '<input ng-model="inputValue" >',

        controller: function ControllingFunction($scope, $element, $attrs, $rootScope) {
            $scope.inputValue = $scope.value;


        },
        compile: function CompilingFunction(element, attrs) {


            return function LinkingFunction(scope, element, attrs, ctrl) {

               $(element).spinner({
                    min: scope.min,
                    max: scope.max,
                    step: scope.step,

                    spin: function (event, ui) {
                        scope.inputValue = ui.value;
                        //alert("spin register");
                        // event.preventDefault();
                        event.stopImmediatePropagation()
                        if (!$(element).is(":focus")) {
                            event.stopPropagation();
                            //$(element).d
                            $(element).spinner("disable");
                            event.stopImmediatePropagation()
                            console.log("OUT");
                        }
                    },

                    change: function (event, ui) {
                        //scope.inputValue = ui.value;
                        //alert("spin register");
                    }

                    /* stop:function(event,ui){
                     alert('Triggered after a spin.');
                     }*/
                });

                /* $(element).bind("keydown", function (event) {
                 alert("keydown");
                 });*/

                $(element).bind("focusout", function (event, ui) {



                    // $(this).siblings('input').spinner("value",1);
                    // element.stop();
                    //element.destroy();

                    //$(element).spinner( "value",0);
                    console.log("focus is out");
                    //$(element).spinner( "stop" );
                    // event.stopImmediatePropagation()
                    // $(element).unbind();
                    // $(element).off("start");
                    //  $(element).off("spinstart");

                });
                /* $(element).unbind("keydown");
                 $(element).unbind("keyup");
                 $(element).unbind("keypress");*/

                $(element).bind("focusin", function (event, ui) {

                    // console.log("focus is in");
                    //$(element).bind();
                    //alert("in");
                    //  console.log($('input').length);
                    // $('input').spinner("value",0);
                    // element.stop();
                    //element.destroy();
                    // $(element).spinner( "value",0.005);
                    // alert("focus is changed");

                });

                /* $('.ui-spinner-button').click(function() {
                 $(this).siblings('input').change();
                 });*/


                $(element).on("spinstop", function (event, ui) {
                    scope.$apply();
                    scope.value = scope.inputValue;
                    // alert("spinstop");
                }), /**/

                    $(element).on("spinchange", function (event, ui) {

                        //       alert("change");
                        scope.$apply();
                        if (!$.isNumeric(scope.inputValue)) {
                            alert("not a number");
                            scope.inputValue = 0;
                        }
                        if (scope.inputValue > scope.max) {
                            alert("larger than maximum");
                            scope.inputValue = scope.max;
                        }
                        if (scope.inputValue < scope.min) {
                            alert("less than minimum");
                            scope.inputValue = scope.min;
                        }
                        scope.value = parseFloat(scope.inputValue);

                    })
            }
        }
    }
});

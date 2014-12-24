'use strict';

String.prototype.toDash = function(){
    return this.replace(/([A-Z])/g, function($1){return "-"+$1.toLowerCase();});
};

realm_components.directive('uiComponent', function($compile) 
{  
    return {
        restrict: 'E',
        replace: false,
        scope: {
            component: '=component'
        },
        template:   "<div class='ui-component__container'>" + 
                    "</div>",
        compile: function CompilingFunction(tElement, tAttrs)
        {
            return {
                pre: function(scope, element, attrs, sectionController) {

                },
                post: function(scope, element, attrs, sectionController) {
                  
                }
              }
        },
        controller: function ComponentController($scope, $element, $attrs)
        {
            $scope.ComponentController = this;

            var componentHTMLString = '<' + $scope.component.type.toDash() + '></' + $scope.component.type.toDash() + '>'; 
            
            console.log('Creating component: ' + componentHTMLString);
            
            var uiComponentContainer = $($element).find('.ui-component__container');
                
            var compiledComponentHTMLString = $compile(componentHTMLString)($scope);
            
            uiComponentContainer.append(compiledComponentHTMLString);



            setTimeout(function(){
                for(var layoutAttribute in $scope.component.layout)
                {
                    $($element).parent().parent().attr(layoutAttribute, $scope.component.layout[layoutAttribute]);
                }

                for(var style in $scope.component.customStyles)
                {
                    $($element).parent().parent().css(style, $scope.component.layout[style]);
                }
            },0);
        }
    }
})
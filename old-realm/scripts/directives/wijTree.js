'use strict';

angular.module('realmApp').directive('wijTree', function () {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            nodes: '=nodes'
        },
        template: '<div>' + 
                    '<ul class="ngWijTree">'+
                    '</ul>' + 
                  '</div>',
        controller: function WijTreeController($scope, $element, $attrs) {
            var testNodes = [{
                text: 'A',
                nodes: [{
                    text: '1',
                    nodes: []
                }, {
                    text: '2',
                    nodes: []
                }]
            }, {
                text: 'B',
                nodes: [{
                    text: '3',
                    nodes: []
                }, {
                    text: '4',
                    nodes: []
                }]
            }];
            
            $element.find('.ngWijTree').wijtree({nodes: testNodes});
            console.log($element.find('.ngWijTree')[0]);
        },
        compile: function WijTreeCompilingFunction(tElement, tAttrs) {
            return function WijTreeLinkingFunction(scope, element, attrs, parentController) {

            }
        }
    }
});
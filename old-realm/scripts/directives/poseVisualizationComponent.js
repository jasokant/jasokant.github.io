'use strict';

app.directive('poseVisualizationComponent', ['$timeout', '$http', '$q', 'RobotService', function($timeout, $http, $q, RobotService) {

    return {
        restrict: 'E',
        replace: false,
        scope: true,
        //require: '^trajectories',
        template:  '<div class="pose-visualization-component__container"> '  +

                        '<div class="pose-visualization-component__labelContainer">'+
                        '<span class="pose-visualization-component__label">Trajectoty:</span>'+
                            '<select>' +
                                '<option ng-repeat="trajectory in trajectories">{{trajectory.name}}</option>'+
                            '</select>'+
                        '</div>'+

                        '<div class="pose-visualization-component__labelContainer">'+
                            '<span class="pose-visualization-component__label">Axis:</span>'+
                            '<select>' +
                                 '<option>X</option>'+
                                 '<option>Y</option>'+
                                 '<option>Z</option>'+
                            '</select>'+
                        '</div>'+
                        '<div class="pose-visualization-component__chartContainer">'+
                            '<div id="chart" class="pose-visualization-component__chart">'+'</div>'+
                        '</div>'+
                    '</div>'  ,
        controller: function ControllerFunction($scope,$element,$attrs,$rootScope)
        {
            $scope.trajectories=
           [
               {
                   name:"1",
                   positions:[
                       [
                       {label:"x", value: 2},
                       {label:"y", value: 2},
                       {label:"z", value: 2}
                       ]

                   ]
               },
               {
                   name:"2",
                   positions:[
                       {label:"x", value: 5},
                       {label:"y", value: 6},
                       {label:"z", value: 3}
                   ]
               },
               {
                   name:"3",
                   positions:[
                       {label:"x", value: 1},
                       {label:"y", value: 0},
                       {label:"z", value: 3}]
               },
               {
                   name:"4",
                   positions:[
                       {label:"x", value: 1},
                       {label:"y", value: 3},
                       {label:"z", value: 5}]
               }

           ]



           $scope.draw=function()
           {
               var width=200;
               var height=400;

               var x1=width/2-50;
               var x2=width/2+50;
               var y1=height/2;
               var y2=height/2;


               var svg = d3.select("chart").append("svg")
                   .attr("width", width)
                   .attr("height", height)
                   .attr("style","background-color:red")
                   .append("g");

               console.log("SVG:")
               console.log(svg);



               var xAxis = svg.append("line")
                   .attr("x1", x1)
                   .attr("y1", y1)
                   .attr("x2", x2)
                   .attr("y2",y2)
                   .attr("stroke-width", 5)
                   .attr("stroke", "red");

               console.log("LINE:")
               console.log(xAxis);

               /*  var x = d3.scale.linear()
                     .range([0, width]);

                 var y = d3.scale.linear()
                     .range([0, height]);

                 var xAxis = d3.svg.axis()
                     .scale(x)
                     .orient("bottom");

                 var yAxis = d3.svg.axis()
                     .scale(y)
                     .orient("left");


                 svg.append("g")
                     .attr("class", "x axis")
                     .call(xAxis);

                 svg.append("g")
                     .attr("class", "y axis")
                     .call(yAxis)
                     .append("text")
                     .attr("transform", "rotate(-90)")
                     .attr("y", 6)
                     .attr("dy", ".71em")
                     .style("text-anchor", "end")
                     .text("Price ($)");*/

           }
            $scope.draw();

        },
        compile: function CompilingFunction(tElement, tAttrs)
        {
            //can only manipulate DOM here (can't access scope yet)
            return function LinkingFunction(scope, element, attrs, ctrl) {
                //can access scope now

            }
        },
        link: function(scope, element, attrs)
        {


        }//link


    }
}]);






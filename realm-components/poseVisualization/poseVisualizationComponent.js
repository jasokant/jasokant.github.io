'use strict';

realm_components.directive('poseVisualizationComponent', ['$timeout', '$http', '$q', 'RobotService', function($timeout, $http, $q, RobotService) {

    return {
        restrict: 'E',
        replace: false,
        scope: true,
        //require: '^trajectories',
        template:  '<div class="pose-visualization-component__container"> '  +

                        '<div class="pose-visualization-component__labelContainer">'+
                        '<span class="pose-visualization-component__label">Trajectoty:</span>'+
                            '<select ng-model="trajectoryName">' +
                                '<option ng-repeat="trajectory in trajectories">{{trajectory.name}}</option>'+
                            '</select>'+
                        '</div>'+

                        '<div class="pose-visualization-component__labelContainer">'+
                            '<span class="pose-visualization-component__label">Axis:</span>'+
                            '<select ng-model="cartesian">' +
                                 '<option>X</option>'+
                                 '<option>Y</option>'+
                                 '<option>Z</option>'+
                            '</select>'+
                        '</div>'+
                        '<div class="pose-visualization-component__chartContainer">'+
                                '<div class="pose-visualization-component__chart">'+'</div>'+
                        '</div>'+
                    '</div>'  ,
        controller: function ControllerFunction($scope,$element,$attrs,$rootScope)
        {
            $scope.trajectories=
           [
               {
                   name: 1,
                   positions:
                   [
                       {
                           timestamp: 1,
                           position: [
                               {label: "x", value: 2},
                               {label: "y", value: 2},
                               {label: "z", value: 2}
                           ]

                       },
                       {
                           timestamp: 2,
                           position: [
                               {label: "x", value: 4},
                               {label: "y", value: 6},
                               {label: "z", value: 10}
                           ]

                       },
                       {
                           timestamp: 3,
                           position: [
                               {label: "x", value: 2},
                               {label: "y", value: 1},
                               {label: "z", value: 3}
                           ]

                       },
                       {
                           timestamp: 4,
                           position: [
                               {label: "x", value: 2},
                               {label: "y", value: 1},
                               {label: "z", value: 3}
                           ]

                       },
                   ]
               },
               {
                   name:2,
                   positions:
                       [
                           {
                               timestamp: 1,
                               position: [
                                   {label: "x", value: 2},
                                   {label: "y", value: 5},
                                   {label: "z", value: 3}
                               ]

                           },
                           {
                               timestamp: 2,
                               position: [
                                   {label: "x", value: 3},
                                   {label: "y", value: 3},
                                   {label: "z", value: 3}
                               ]

                           }
                       ]//end of positions
               }//end of trajectory
           ]//end of trajectories
//----------------------------------------------------------
            $scope.trajectoryName=$scope.trajectories[0].name;
            $scope.cartesian="X";
 //------------------------------------------------------
            $scope.getTrajectoryByName=function(name)
            {
                for(var i=0;i<$scope.trajectories.length;i++)
                {
                    if($scope.trajectories[i].name==name)
                    {
                        return $scope.trajectories[i];
                    }
                }
            }
//---------------------------------------------------
            $scope.getCartesian=function(positions, cartesian)
            {
                var cartesianArray=new Array();

                for(var i=0;i<positions.length;i++)
                {
                    for(var j=0;j<positions[i].position.length;j++)
                    {
                        if(positions[i].position[j].label==cartesian.toLowerCase())
                        {
                            var position=new Object();
                            position.timestamp=positions[i].timestamp;
                            position.value=positions[i].position[j].value;
                            cartesianArray.push(position);
                        }
                    }
                }
                return cartesianArray;
            }
//--------------------------------------------------------
            $scope.$watch('cartesian',function()
            {
                draw($scope.trajectoryName,$scope.cartesian);
            });

            $scope.$watch('trajectoryName',function()
            {
                draw($scope.trajectoryName,$scope.cartesian);
            });
//-----------------------------------------------------------------
            var draw=function(name,cartesian)
            {
                //gets the trajectory by its name from trajectories
                var trajectory=$scope.getTrajectoryByName(name);
                //gets the position array---> {timestamp , value} for x, y, or z
                var positions=$scope.getCartesian(trajectory.positions, cartesian)
                var positionArray=new Array()
                var timestampArray=new Array()
                for(var i=0;i<positions.length;i++)
                    positionArray.push(positions[i].value);

                for(var i=0;i<positions.length;i++)
                    timestampArray.push(positions[i].timestamp);

                d3.select("svg").remove();

                var width=380;
                var height=300;

                var chart=$element.find("div")[4];

                var x = d3.scale.linear()
                    .domain([1,d3.max(timestampArray)]) //here we can add a number that is the max possible in general
                    .range([0, width-20]);

                var y = d3.scale.linear()
                    .domain([0,10])
                    .range([height-20, 0]);

                var xAxis = d3.svg.axis()
                    .scale(x)
                    .ticks(timestampArray.length)
                    .tickValues(timestampArray)
                    .tickFormat(d3.format(",.0f"))
                    .orient("bottom");

                var yAxis = d3.svg.axis()
                    .scale(y)
                    .orient("left");

                var svg = d3.select(chart).realmend("svg")
                    .attr("width", width)
                    .attr("height", height);

                svg.realmend("g")
                    .attr("class", "axis")
                    .attr("transform", "translate(0," + 280 + ")")
                    .call(xAxis);

                svg.realmend("g")
                    .attr("class", "axis")
                    .call(yAxis)
                    .realmend("text")
                    //.attr("transform", "rotate(-90)")
                    .attr("y", 6)
                    .attr("x", 6)
                    .attr("dy", ".71em")
                    //.style("text-anchor", "end")
                    .text(cartesian);


                var line = d3.svg.line()
                    .x(function(d) { return x(d.timestamp); })
                    .y(function(d) { return y(d.value); });

                svg.realmend("path")
                    .datum(positions)
                    .attr("class", "line")
                    .attr("d", line);


                //remove the first tick label
                svg.selectAll(".tick").selectAll("text")
                    .each(function (d, i) {
                        if ( i==0 && d == 1 ) {
                            this.remove();
                        }

                    });


            }
            draw($scope.trajectoryName,$scope.cartesian);


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






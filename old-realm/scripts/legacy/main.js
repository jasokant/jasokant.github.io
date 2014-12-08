'use strict';
function Person(data)
{
    this.personID = data.personID;
    this.courses = data.courses;
    this.name = data.name;
    this.email = data.email;
}

function Course(data)
{
    this.courseID = data.courseID;
    this.name = data.name;
}

function Assignment(data)
{
    this.assignmentID = data.assignmentID;
    this.name = data.name;
    
    this.courseID = data.courseID;
}

function Document(data)
{
    this.documentID = data.documentID;
    this.assignmentID = data.assignmentID;
    this.personID = data.personID;
    this.name = data.name;
}

function Team(data)
{
    this.teamID = data.teamID;
    this.personIDs = data.personIDs;
    
}

function Case(data)
{
    this.id = data.id;
    this.name = data.name;
    this.type = data.type;
    this.status = data.status;
    this.caption = data.caption;
    this.dueDate = data.dueDate;
    this.priority = data.priority;
    this.courseID = data.courseID;
    this.assignmentID = data.assignmentID;
    this.teamID = data.teamID;
    
    this.modificationDates = [];
    this.modificationDates.push(new Date());
}

function Session(data)
{
    this.id = data.id;
    this.name = data.name;
    this.beginDate = data.beginDate;
    this.endDate = data.endDate;
}

angular.module('realmApp')
.controller('MainController', function ($scope, $ionicModal) 
{
    $scope.model = {};
    $scope.model.title = "REALM";
    
                
    $scope.toggleMenu = function()
    {
        $scope.sideMenuController.toggleLeft();
    };
    
    $scope.treedata = [
        { "label" : "Cases", "id" : "role1", "children" : []}
    ]; 
}); 

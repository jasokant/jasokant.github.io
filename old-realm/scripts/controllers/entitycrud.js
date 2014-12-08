'use strict'

angular.module('REALM').controller('EntityCRUDController').controller('EntityCRUDController',['$scope','$http','$q',function($scope,$http,$q){

	var APIurl = "http://realmproject.net:8080/app/repo/";

	$scope.transactionMetaData = {
		selectedActionType: "Create",
		actionTypes: ["Create","Read/Update"],
		selectedEntityType: "Person",
		entityTypes: ["Person","Session","Lesson"]
	};
	
	$scope.entityMetaData = {
		"Person":{
			"properties":[
			"name",
			"email",
			"pwdHashed"
			],
			"references":{
				"singular":[],
				"multiple":[]
			}
		},
		"Session":{
			"properties":[
			"startTime",
			"duration",
			"sessionToken"
			],
			"references":{
				"singular":[{"name":"lesson","href":"Lesson"},{"name":"coordinator","href":"Person"}],
				"multiple":[{"name":"team","href":"Person"}]
			}
		},
		"Lesson":{
			"properties":[
			"name"
			],
			"references":{
				"singular":[],
				"multiple":[]
			}
		}
	};

	$scope.newEntity = {
		properties:{},
		references:{
			singular:[{"name":"lesson","val":"Lesson-1"}],
			multiple:[{"name":"team","val":["Person-1","Person-2"]}]
		}
	};
	$scope.newReferences = [];

	$scope.entityToRead = {
		loc:"",
		val:""
	};

	
	$scope.addReference = function(refArray, val)
	{
		refArray.push(val);
	}

	$scope.createEntity = function()
	{
		var entityJSON = {
			"loc": $scope.transactionMetaData.selectedEntityType,
			"value":{}
		};

		for(var property in $scope.newEntity.properties)
		{
			entityJSON.value[property] = $scope.newEntity.properties[property];
		}

		for(var i=0;i<$scope.newEntity.references.length;i++)
		{
			entityJSON.value[$scope.newEntity.references[i].name] = $scope.newEntity.references[i].val;
		}
		
		$http.post(APIurl, entityJSON).then(function(response){
			
			$scope.readEntityFromResponse(response.data);
		
		},function(reason){
			
			console.log(reason);
		
		});

		//USE THIS CODE WHEN REPO IS DOWN
		/*var fakeResponse = {
			"loc": "Person-1",
			"value": {
				"email": "bh4w@realm.net",
				"pwdHashed": "1234",
				"name": "Billy H. Willy 4",
				"role": null,
				"sessions": ["Session-1","Session-2"]
			}
		};
		$scope.readEntityFromResponse(fakeResponse)*/
	}

	$scope.readEntityFromResponse = function(entity)
	{
		$scope.transactionMetaData.selectedActionType="Read/Update";
		$scope.entityToRead = entity;
	}

	$scope.readEntityByID = function(id)
	{
		var queryURL = APIurl + $scope.transactionMetaData.selectedEntityType + "-" + id;
		
		$http.get(queryURL).success(function(response){
			$scope.entityToRead = entity;
		});
	}

	$scope.updateEntity = function()
	{
		var httpResponseCode = $q.defer();
		$http.post(APIurl,$scope.entityToRead);
	}

	$scope.isArray = function(obj)
	{
		return Object.prototype.toString.call(obj) === '[object Array]';
	}
}]);
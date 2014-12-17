'use strict';

angular.module('realm.services').service('LayoutService', function(){
	var that = this;
	


    alert('test');

	this.getLayout = function(assignmentLocation)
	{
		var deferred = $q.defer();

		var layout = {
			components:[{
				'componentType': 'cameraFeed',
				'layout':'vertical',
				'flex-sm':50,
				'offset-sm':33,
				'flex-md':25,
				'offset-md':20,
				'flex-lg':20,
				'offset-lg':20
			}]
		}

		deferred.resolve(layout);

		return layout;
	}	
});
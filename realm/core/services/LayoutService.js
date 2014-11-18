'use strict'

realm_services.('LayoutService', function($http, $q, $timeout, $rootScope, RepoService){
	var that = this;
	
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
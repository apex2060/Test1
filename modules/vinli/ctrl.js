app.lazy.controller('VinliCtrl', function($rootScope, $scope, $routeParams, $http, $q, config, Data, Auth){
    $scope.vinliUrl = 'https://auth.vin.li/oauth/authorization/new?client_id='+config.vinli.client_id+'&response_type=token&redirect_uri='+config.vinli.redirect_uri+''
	var tools = $scope.tools = {
	    
	}

	it.VinliCtrl = $scope;
});


/*
    Due to vinli's lack of global data support (it does not work in northern AZ where tmobile is not available).  vinli is not the most reliable source.  
    Put a small tablet in every vehicle with a bt obd - 
    use the tablet to: 
    - track vehicle usage
    - provide forms
        - fill out safety reports
        - fill out vehicle inspections
        - fill out transportation reports
          (equipment || material)
        - receive company notifications
        - 
*/
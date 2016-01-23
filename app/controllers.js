app.controller('SiteCtrl', function($rootScope, $scope, $routeParams, $http, $timeout, config, Auth){
	$scope.alerts = [];
	it.user = Auth;
	Auth.init().then(function(me){
		$rootScope.user = Auth;
	})
	
	var tools = $rootScope.tools = {
		clearStorage: function(){
			if(prompt('Enter Clear Code: ') == '159487')
				localStorage.clear();
		},
		user: {
			logout: function(){
				Auth.tools.logout();
				$rootScope.user = null;
				var loc = document.location.href
				document.location.href = "https://www.google.com/accounts/Logout?continue=https://appengine.google.com/_ah/logout?continue="+loc;
			},
			login: function(){
				Auth.tools.login().catch(function(response){
					if(response && response.error)
						alert(response.error);
				})
			},
			addScope: function(scope){
				return Auth.tools.google.scopes(scope)
			}
		}
	}
	
	$rootScope.config = config;
	it.SiteCtrl = $scope;
});


// app.controller('DrawerCtrl', function($rootScope, $scope, $routeParams){
// 	$scope.visable 		= true;
// 	$scope.position 		= 'bottom';
// 	$scope.partial 		= '/partials/generic.html';
// 	$scope.height 		= '300px';
	
// 	$rootScope.$on("drawer", function(e, params) {
// 		console.log(e)
// 		if(params.visable != undefined)
// 			$scope.visable = params.visable;
// 		if(params.position != undefined)
// 			$scope.position = params.position;
// 		if(params.partial != undefined)
// 			$scope.partial = params.partial;
// 		if(params.height != undefined)
// 			$scope.height = params.height;
// 		if(params.scope != undefined)
// 			$scope.scope = params.scope;
// 	});
	
// 	it.DrawerCtrl = $scope;
// });
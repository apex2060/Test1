app.controller('SiteCtrl', function($rootScope, config, Auth){
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
	it.SiteCtrl = $rootScope;
});
app.factory('config', function ($http, $q) {
	var config = {};
	function init(newConfig){
		config = angular.copy(newConfig)
		Parse.initialize(config.parse.appId, config.parse.jsKey);
		$http.defaults.headers.common['X-Parse-Application-Id'] = config.parse.appId;
		$http.defaults.headers.common['X-Parse-REST-API-Key'] = config.parse.restKey;
		$http.defaults.headers.common['Content-Type'] = 'application/json';
	}
	function pConfig(){
		var deferred = $q.defer();
		$http.get('https://api.parse.com/1/classes/Config').success(function(data){
			config = angular.extend(config, {params:data.results[0]});
			deferred.resolve(config);
		})
		return deferred.promise;
	}
	var rootConfig = {
		init: 		init,
		pConfig: 	pConfig,
		domain: 	'easybusiness.center',
		secureUrl: 	'https://the.easybusiness.center',
		oauth: 		encodeURI('https://the.easybusiness.center/oauth'),
		parse: {
			root: 		'https://api.parse.com/1',
			appId: 		'ETf61cYOebIkncxvVgrldjmPX4Z2acpWiKfY9wWM',
			jsKey: 		'i3MNq4GYuP6ays3LNQdijimLuaN5uOJst1n87bVy',
			restKey: 	'Wcpk6SaGnzklz5S0OhtngeYD6KJzNIoQ3VmyUgtK'
		},
		firebase: 'https://easybusiness.firebaseio.com/',
		google: {
			"client_id": "821954483-q3ooncrbh8cmo8ukcupov77hfn41i6g9.apps.googleusercontent.com",
			"project_id": "easy-business-center",
			"auth_uri": "https://accounts.google.com/o/oauth2/auth",
			"token_uri": "https://accounts.google.com/o/oauth2/token",
			"auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
			"client_secret": "jG4FoLYpU6TC7Pfk9O3iZtJV",
			"redirect_uris": ["https://root-apex2060.c9users.io/oauth", "https://easybusiness.center/oauth", "http://easybusiness.center/oauth"],
			"javascript_origins": ["https://root-apex2060.c9users.io", "http://easybusiness.center", "https://easybusiness.center"]
		},
		cloudinary: {
			"cloud_name": "easybusiness",
			"preset": "mainSite"
		}
	}

	init(rootConfig);
	pConfig();
	return config;
});
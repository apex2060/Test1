app.factory('config', function ($http, $q) {
	var config = {
		domain:			'easybusiness.center',
		devUrl: 		'https://root-apex2060.c9users.io',
		secureUrl: 		'https://the.easybusiness.center',
		oauthURL: 		'https%3A%2F%2Fthe.easybusiness.center/oauth',
		parse: {
			root: 		'https://api.parse.com/1',
			appId: 		'ETf61cYOebIkncxvVgrldjmPX4Z2acpWiKfY9wWM',
			jsKey: 		'i3MNq4GYuP6ays3LNQdijimLuaN5uOJst1n87bVy',
			restKey: 	'Wcpk6SaGnzklz5S0OhtngeYD6KJzNIoQ3VmyUgtK'
		},
		firebase: 'https://easybusiness.firebaseio.com/',
		//
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
		weather: {
			url: 	'http://api.openweathermap.org/data/2.5/weather', //?q=cityName
			apiKey: '0e9d9bb347f90f73048aa7ae74c8ed44',
		},
		dash: {
			// client_id: 	'YjEzNGNlNWUtZmFkYy00NDk2LWE3NWEtZGI4NjYzOTE4NTJj'
			client_id: 		'ZWYwZmE5YjgtYzg0My00YmE2LThmNDctYzBiNTU1ODE0OTA1'
		},
		vinli: {
			app_id: 		'99f0ce02-30a1-4757-a042-b141820d5115',
			client_id: 		'fdb4c09b-a21c-4c14-bb9a-a3529c49445b',
			redirect_uri: 	'https://jhcc-dev.parseapp.com/vinli'
		},
		kimono: {
			api_key: 		'dGHEKwCxK00Q4ybXVx8i4tx1cDdj2pto'
		},
		company: {
			name: 		'Business Center.',
			address1: 	'',
			address2: 	'',
			phone: 		''
		}
	}
	
	Parse.initialize(config.parse.appId, config.parse.jsKey);
	$http.defaults.headers.common['X-Parse-Application-Id'] = config.parse.appId;
	$http.defaults.headers.common['X-Parse-REST-API-Key'] = config.parse.restKey;
	$http.defaults.headers.common['Content-Type'] = 'application/json';
	
	return config;
});
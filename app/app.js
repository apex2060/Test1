var it = {};
var app = null;

app = angular.module('RootApp', ['ngAnimate','ngResource','ngRoute','ngTouch','xeditable','textAngular','sticky','ui.sortable','chart.js','ngDraggable']);
app.config(function($routeProvider,$compileProvider,$controllerProvider,$provide) {
	app.lazy = {
		controller: $controllerProvider.register,
		factory: 	$provide.factory,
		service: 	$provide.service,
	};

	var parent 		= ['scalehouse','page']
 	// :module/index.html		>	:module/ctrl.js
	var child		= ['admin', 'employee', 'communication']
	// :module/:view/index.html	> 	:module/:view/ctrl.js
	var sibbling	= ['main']
	// :module/:view.html		> 	:module/ctrl.js
	var double		= []
	// :module/:view/index.html	> 	:module/ctrl.js + :module/:view/ctrl.js
	
	// Require specific js files for modules.
	function requires($q, module, view, id){
		var deferred = $q.defer();
		var includes = [];
		
		if(module=='admin'){
			includes.push('vendor/jSignature/flashcanvas.js')
			includes.push('vendor/jSignature/jSignature.min.js')
		}
		
		
		if(parent.indexOf(module) != -1)
			includes.push('modules/'+module+'/ctrl.js');
		if(child.indexOf(module) != -1)
			if(view)
				includes.push('modules/'+module+'/'+view+'/ctrl.js');
			else
				includes.push('modules/'+module+'/ctrl.js');
		if(sibbling.indexOf(module) != -1)
			includes.push('modules/'+module+'/ctrl.js');
		if(double.indexOf(module) != -1){
			includes.push('modules/'+module+'/ctrl.js');
			if(view)
				includes.push('modules/'+module+'/'+view+'/ctrl.js');
		}
		if(!includes.length)
			if(view)
				includes.push('modules/'+module+'/'+view+'/ctrl.js');
			else
				includes.push('modules/'+module+'/ctrl.js');
				
		console.log(includes)
		if(includes.length)
			require(includes, function () {
				deferred.resolve();
			});
		else
			deferred.resolve();
			
		return deferred.promise;
	}
	function path(module, view, id){
		if(parent.indexOf(module) != -1)
			return 'modules/'+module+'/index.html';
		if(child.indexOf(module) != -1)
			if(view)
				return 'modules/'+module+'/'+view+'/index.html';
			else
				return 'modules/'+module+'/index.html';
		if(sibbling.indexOf(module) != -1)
			if(view)
				return 'modules/'+module+'/'+view+'.html';
			else
				return 'modules/'+module+'/index.html';
		if(double.indexOf(module) != -1)
			if(view)
				return 'modules/'+module+'/'+view+'/index.html';
			else
				return 'modules/'+module+'/index.html';
				
		if(view)
			return 'modules/'+module+'/'+view+'/index.html';
		else
			return 'modules/'+module+'/index.html';
	}

	$routeProvider
	.when('/:module', {
		reloadOnSearch: false,
		templateUrl: function(){
			var pieces = location.hash.split('/');
			return path(pieces[1])
		},
		resolve: {
			load: ['$q', '$rootScope', '$location', function ($q, $rootScope, $location) {
				var pieces = $location.path().split('/');
				return requires($q, pieces[1], null, null)
			}]
		}
	})
	.when('/:module/:view', {
		reloadOnSearch: false,
		templateUrl: function(){
			var pieces = location.hash.split('/');
			return path(pieces[1], pieces[2])
		},
		resolve: {
			load: ['$q', '$rootScope', '$location', function ($q, $rootScope, $location) {
				var pieces = $location.path().split('/');
				return requires($q, pieces[1], pieces[2], null)
			}]
		}
	})
	.when('/:module/:view/:id', {
		reloadOnSearch: false,
		templateUrl: function(){
			var pieces = location.hash.split('/');
			return path(pieces[1], pieces[2], pieces[3])
		},
		resolve: {
			load: ['$q', '$rootScope', '$location', function ($q, $rootScope, $location) {
				var pieces = $location.path().split('/');
				return requires($q, pieces[1], pieces[2], pieces[3])
			}]
		}
	})
	.otherwise({
		redirectTo: '/page/main'
	});
});

app.run(['$window', '$rootScope', function($window, $rootScope) {
	new WOW().init();
	$rootScope.$on('$routeChangeStart', function(next, current) {
		new WOW().sync();
	});
}])
app.run(function(editableOptions) {
	editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
});




var inc = [
	'//cdnjs.cloudflare.com/ajax/libs/Chart.js/1.0.2/Chart.min.js',
	'//widget.cloudinary.com/global/all.js',
	'//www.parsecdn.com/js/parse-1.3.1.min.js',
	'//cdn.firebase.com/js/client/1.0.21/firebase.js',
	'//checkout.stripe.com/checkout.js',
	
	'//apis.google.com/js/client:platform.js?onload=letsBegin',
	'//maps.google.com/maps/api/js?sensor=true&libraries=geometry,drawing',
	'//cdnjs.cloudflare.com/ajax/libs/moment.js/2.8.4/moment.js',
	'//cdnjs.cloudflare.com/ajax/libs/wow/1.0.3/wow.min.js',
	'//cdn.plaid.com/link/stable/link-initialize.js'
]

require(inc, function(){
	require(['vendor/angular-chart.js'], function(){
		angular.bootstrap(document, ['RootApp']);
	})
})




// // All the following is to allow google visualizations...
// var vizPromise = new Promise(function(resolve, reject) {
// 	google.setOnLoadCallback(function () {  
// 		resolve();
// 	});
// });
// var letsBegin = null;
// var authPromise = new Promise(function(resolve, reject) {
// 	letsBegin = function(){
// 		resolve();
// 	}
// });

// Promise.all([vizPromise, authPromise]).then(function() {
// 	angular.bootstrap(document, ['RootApp']);
// }, function() {
// 	toastr.error('Something went wrong.', 'Please Reload')
// });

// google.load('visualization', '1', {packages: ['gauge']});
// google.load('visualization', '1', {packages: ['corechart']});
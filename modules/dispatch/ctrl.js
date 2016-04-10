app.lazy.controller('MapsCtrl', function($scope, $http, $timeout, NgMap, Auth, config){
	config.hourOffset = 1;
	$scope.moment = moment;
	// NgMap.getMap().then(function(map) {
	// 	$scope.map = map;
	// });
	$scope.marker = {
		url: 'https://the.easybusiness.center/static/images/cement64.png'
	}
	var tools = $scope.tools = {
		init: function(){
			tools.truck.init();
		},
		truck: {
			init: function(){
				tools.truck.load();
			},
			load: function(){
				$http.post(config.parse.root+'/functions/multiCurrent').success(function(r){
					$scope.trucks = r.result
					$scope.route = []
					$timeout(tools.truck.load, 1000*60*1)
				}).error(function(e){
					toastr.error('Error Loading Data.')
					$timeout(tools.truck.load, 1000*60*5)
				})
			},
			route: function(truck){
				$http.post(config.parse.root+'/functions/singleRoute', truck).success(function(r){
					// $scope.route = r
					$scope.route = r.result.map(function(pt){return [pt.lat, pt.lng]})
				}).error(function(e){
					toastr.error('Error Loading Data.')
				})
			},
			info: function(m,t){
				t.lastSeen = moment(t.Datetime).add('h',config.hourOffset)
				$scope.truck = t
				$('#truckInfo').modal('show')
			}
		}
	}
	Auth.init().then(function(){
		tools.init();
	})
	it.MapsCtrl = $scope;
});
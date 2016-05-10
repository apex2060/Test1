app.lazy.controller('TestCtrl', function($rootScope, $scope, $http, config){
	$scope.dbs = ['hdlibrary', 'hdmobile', 'hdclient', 'hdapi']
	$scope.history = []
	var tools = $scope.tools = {
		init: function(db){
			$scope.db = db;
			$scope.history.push({db:db, tables:[]})
			tools.schema(db);
		},
		schema: function(db){
			$http.post('/api', {
				method: 'GET',
				path: 	'/'+db+'/_schema'
			}).success(function(data){
				$scope.schema = data.resource
			})
		},
		load: function(table){
			$scope.history[$scope.history.length-1].tables.push(table)
			$http.post('/api', {
				method: 'GET',
				path: 	'/'+$scope.db+'/_table/'+table
			}).success(function(data){
				$scope.list = data.resource;
				if(data.resource[0])
					$scope.keys = Object.keys(data.resource[0]);
				else
					toastr.error('No Data Available')
				$scope.step = []
				// $('#infoModal').modal('show')
			}).error(function(e){
				toastr.error(e)
			})
		}
	}
	tools.init($scope.dbs[0]);
	
	it.TestCtrl = $scope;
});
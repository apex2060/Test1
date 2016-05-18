app.lazy.controller('TestCtrl', function($rootScope, $scope, $http, $q, config){
	$scope.dbs = ['hdlibrary', 'hdmobile', 'hdclient', 'hdapi', 'commandbatch']
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
			$scope.status = 'Loading...'
			$scope.history[$scope.history.length-1].tables.push(table)
			$http.post('/api', {
				method: 'GET',
				path: 	'/'+$scope.db+'/_table/'+table
			}).success(function(data){
				$scope.status = 'Complete!'
				// $scope.table = table;
				$scope.data = data;
				if(data.resource[0])
					$scope.keys = Object.keys(data.resource[0]);
				else
					toastr.error('No Data Available')
				$scope.step = []
				// $('#infoModal').modal('show')
			}).error(function(e){
				toastr.error(e)
			})
		},
		discover: function(needle){
			var discoveries = $scope.discoveries = [];
			var db = $scope.db
			function schema(){
				return $http.post('/api', {
					method: 'GET',
					path: 	'/'+db+'/_schema'
				})
			}
			function table(table){
				return $http.post('/api', {
					method: 'GET',
					path: 	'/'+db+'/_table/'+table
				})
			}
			
			schema().success(function(data){
				data.resource.forEach(function(s){
					table(s.name).success(function(t){
						var keys = Object.keys(t.resource[0]);
						t.resource.forEach(function(r, i){
							keys.forEach(function(key){
								$scope.status = db+': '+s.name+': ('+i+')['+key+']'
								if(r[key] == needle)
									discoveries.push({
										table: s.name,
										row: r,
										key: key
									})
							})
						})
					})
				})
			})
		},
		understand: function(db, table){
			var calls = []
			function schema(table){
				console.log(db, table)
				return $http.post('/api', {
					method: 'GET',
					path: 	'/'+db+'/_schema/'+table
				})
			}
			function dep(table){
				var defer = $q.defer();
				if(calls.indexOf(table) != -1){
					defer.resolve({message:'Already refrenced', field:[]})
				}else{
					calls.push(table)
					schema(table).success(function(schema){
						var fields = schema.field;
						var promises = []
						fields.forEach(function(field){
							if(field.ref_table && field.ref_fields){
								promises.push(
									dep(field.ref_table).then(function(deps){
										field.deps = deps
									})
								)
							}
						})
						$q.all(promises).then(function(){
							defer.resolve(schema)
						})
					});
				}
				return defer.promise;
			}
			function reduce(tbl){
				var table = {name: tbl.name, deps: []}
				tbl.field.forEach(function(field){
					if(field.deps && field.deps.name)
						table.deps.push(reduce(field.deps))
				})
				return table
			}
			if(table)
				dep(table).then(function(result){
					$scope.deps = reduce(result);
				})
		}
	}
	tools.init($scope.dbs[0]);
	
	it.TestCtrl = $scope;
});
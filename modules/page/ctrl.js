app.lazy.controller('PageCtrl', function($scope, $routeParams, $q, Auth, Parse){
	var Page = new Parse('Pages');

	$scope.Data = {};
	$scope.data = {};
	$scope.template = '';
	var defaultPage = {
		permalink: $routeParams.view,
		template: '<div class="alert alert-info">Page Does Not Exist</div>',
		data: []
	}
	// [] Load existing templates as options.
	
	var tools = $scope.tools = {
		init: function(){
			tools.get();
		},
		get: function(){
			// [] Make this content available offline once loaded for the first time.
			if($routeParams.id){
				Page.get($routeParams.id).then(function(result){
					$scope.page = result || defaultPage;
					tools.setup($scope.page)
				})
			}else{
				Page.query('?where={"permalink":"'+$routeParams.view+'"}').then(function(list){
					$scope.page = list[0] || defaultPage;
					tools.setup($scope.page)
				})
			}
		},
		setup: function(page){
			var promises = []
			for(var i=0; i<page.data.length; i++)
				promises.push(tools.data.init(page.data[i]))
			$q.all(promises).then(function(){
				$scope.template = page.template
			})
		},
		data: {
			init: function(request){
				var deferred = $q.defer();
				tools.data.get(request).then(function(list){
					$scope.data[request.alias] = list;
					deferred.resolve(list)
				})
				return deferred.promise;
			},
			get: function(request){
				var data = $scope.Data[request.alias] = new Parse(request.table);
				if(request.query)
					return data.query(request.query)
				else
					return data.list()
			},
			add: function(){
				$scope.page.data.push({})
			}
		},
		edit: function(){
			$('#editPage').modal('show')
		},
		preview: function(){
			tools.setup($scope.page);
		},
		save: function(){
			Page.save($scope.page).then(function(page){
				$scope.page = page;
				toastr.success('Page Saved');
			})
		},
		element: {
			add: function(){
				
			},
			remove: function(){
				
			}
		}
	}
	tools.init();
	
	it.PageCtrl = $scope;
});
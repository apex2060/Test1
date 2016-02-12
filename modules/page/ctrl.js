app.lazy.controller('PageCtrl', function($scope, $routeParams, $location, $q, Auth, Parse){
	var Page = new Parse('Pages', true);
	
	$scope.moment = moment;
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
			tools.keyEvents();
			$scope.$on('$locationChangeStart', function(event) {
				if($routeParams.view == $scope.page.permalink)
					tools.setup($scope.page)
				else
					tools.get();
			});
		},
		keyEvents: function(){
			require(['vendor/mousetrap.js'], function(Mousetrap){
				Mousetrap.bind('ctrl+e', function(e){
					if(Auth.is('Admin'))
						tools.edit();
				});
				Mousetrap.bind(['ctrl+s', 'meta+s'], function(e){
					if (e.preventDefault) {
						e.preventDefault();
					}
					else {
						e.returnValue = false;
					}
					if(Auth.is('Admin'))
						tools.save();
				});
			});
			$scope.$on('$routeChangeStart', function(next, current) {
				Mousetrap.reset();
			});
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
				$scope.template = page.template;
				eval('$scope.js = '+page.js)
				if($scope.js && $scope.js.init)
					$scope.js.init($scope.data);
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
				var data = $scope.Data[request.alias] = new Parse(request.table, true); //[] Allow this (immediate) to be defined by the user
				
				var vars = $location.search();
				var query = request.query;
				if(request.query && request.rpv)
					for(var i=0; i<request.rpv.length; i++)
						query = query.replace('%'+request.rpv[i]+'%', vars[request.rpv[i]])
						
				if(query)
					return data.query(query)
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
			$scope.page.data = tools.format($scope.page.data)
			tools.setup($scope.page);
		},
		save: function(){
			$scope.page.data = tools.format($scope.page.data)
			Page.save($scope.page).then(function(page){
				$scope.page = page;
				toastr.success('Page Saved');
			})
		},
		format: function(queries){
			for(var i=0; i<queries.length; i++){
				var query = '--'+queries[i].query+'--';
				query = query.split("\%");
				queries[i].rpv = [];
				for(var ii=0; ii<query.length; ii++)
					if(ii%2)
						queries[i].rpv.push(query[ii])
			}
			return queries;
		},
		
		focus: function(item){
			$scope.focus = item;
		},
		modal: function(modal){
			$(modal).modal('show');
		},
		focusModal: function(item, modal){
			tools.focus(item);
			tools.modal(modal);
		}
	}
	tools.init();
	it.PageCtrl = $scope;
});
app.lazy.controller('PageCtrl', function($scope, $routeParams, $location, $sce, $q, config, Auth, Parse){
	var Page = new Parse('Pages', true);
	
	$scope.moment = moment;
	$scope.Live = {};
	$scope.Data = {};
	$scope.data = {};
	$scope.params = $routeParams;
	$scope.search = $location.search();
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
				tools.data.unListen()
				if($routeParams.view == $scope.page.permalink)
					tools.setup($scope.page)
				else{
					delete $scope.page
					tools.get();
				}
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
			if($scope.page){
				tools.setup($scope.page)
			}else{
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
					$scope.data = $scope.js.init($scope.data) || $scope.data;
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
			unListen: function(){
				var keys = Object.keys($scope.Live)
				keys.forEach(function(key){
					$scope.Live[key].off('value')
				})
			},
			get: function(request){
				if($scope.Data[request.alias]){
					var data = $scope.Data[request.alias]
					var live = $scope.Live[request.table]
				}else{
					var data = $scope.Data[request.alias] = new Parse(request.table, true); //[] Allow this (immediate) to be defined by the user
					var live = $scope.Live[request.table] = {
						request: 	request,
						ref: 		new Firebase(config.firebase+'/class/'+request.table),
						timestamp: 	false
					}
					live.ref.on('value', function(ds){
						if(!live.timestamp)
							live.timestamp = ds.val().updatedAt.time
						else if(live.timestamp != ds.val().updatedAt.time)
							tools.init();
					})
				}
				
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
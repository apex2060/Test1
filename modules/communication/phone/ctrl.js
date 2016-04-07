app.lazy.controller('PhoneCtrl', function($rootScope, $scope, $routeParams, $http, Parse, config){
	$scope.view = 'list';
	var Numbers = new Parse('PhoneNumbers');
	var Endpoints = new Parse('PlivoEndpoints');
	var days = $scope.days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
	
	
	
	var tools = $scope.tools = {
		init: function(){
			tools.number.init();
			tools.endpoint.init();
		},
		view: function(view){
			if(view)
				$scope.view = view;
			return '/modules/communication/phone/view/'+$scope.view+'.html'
		},
		number: {
			init: function(){
				Numbers.list().then(function(list){
					$scope.numbers = list;
				})
			},
			focus: function(number){
				$scope.number = number
				$scope.view = 'number'
			},
			open: function(){
				$scope.view = 'list'
			},
			new: function(){
				alert('Registering new number!')
			},
			lookup: function(areaCode){
				$http.post(config.parse.root+'/functions/listPhoneNumbers', {
					pattern: areaCode
				}).success(function(data){
					$scope.numbers = data.result;
				})
			},
			register: function(number){
				if(confirm('Please confirm your purchase of: '+number.number)){
					Numbers.save({
						type: 	'phone',
						number:	number.number,
						city: 	number.rate_center,
						state: 	number.region
					}).then(function(d){
						toastr.success(number.number, 'Number Registered!')
					})
				}
			},
			save: function(){
				if(!$scope.number)
					return;
				alert('saving soon')
			}
		},
		endpoint: {
			init: function(){
				Endpoints.list().then(function(list){
					$scope.endpoints = list;
				})
			},
			focus: function(endp){
				$scope.endpoint = endp;
			}
		},
		rule: {
			focus: function(rule){
				$scope.focusType = 'rule';
				$scope.focus = rule;
			},
			add: function(obj){
				if(!$scope.number.rules)
					$scope.number.rules = [];
				$scope.number.rules.push(obj)
			},
			time: {
				manage: function(rule, time){
					
				}
			}
		},
		flow: {
			focus: function(flow){
				$scope.focusType = 'flow';
				$scope.focus = flow;
			},
			add: function(obj){
				if(!$scope.number.flows)
					$scope.number.flows = [];
				$scope.number.flows.push(obj)
			},
			time: {
				manage: function(flow, time){
					
				}
			}
		},
		action: {
			add: function(flow, obj){
				if(!flow.actions)
					flow.actions = [];
				flow.actions.push(obj)
			},
			time: {
				manage: function(flow, time){
					
				}
			}
		},
		item: {
			focus: function(item){
				$scope.focus = item;
			},
			copyTo: function(list, item){
				list.push(angular.copy(item));
			},
			tFocus: function(item){
				$scope.tFocus = item;
			},
			remove: function(list, item){
				if(confirm('Are you sure you want to remove this item?'))
					list.splice(list.indexOf(item), 1)
			},
		},
	}
	tools.init();
	
	it.PhoneCtrl = $scope;
});
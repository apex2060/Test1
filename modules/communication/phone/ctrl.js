app.lazy.controller('PhoneCtrl', function($rootScope, $scope, $routeParams, $http, Parse, config){
	$scope.view = 'list';
	var Numbers = new Parse('PhoneNumbers');
	var Endpoints = new Parse('PhoneEndpoints');
	var days = $scope.days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
	var countryCodes = $scope.countryCodes = [
		{title: 'United States', 	code: 'US'},
		{title: 'United Kingdom', 	code: 'GB'},
		{title: 'Germany', 			code: 'DE'},
		{title: 'Brazil', 			code: 'BR'},
		{title: 'Switzerland', 		code: 'CH'},
		{title: 'New Zealand', 		code: 'NZ'},
	]
	
	
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
			modal: function(){
				$scope.numberSearch = {country_iso:'US'}
				$('#newNumberModal').modal('show')
			},
			search: function(params){
				$http.post(config.parse.root+'/functions/listPhoneNumbers', params).success(function(data){
					$scope.numberOptions = data.result.objects
				}).error(function(e){
					toastr.error(e)
				})
			},
			purchase: function(number){
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
			save: function(number){
				Numbers.save(number).then(function(r){
					toastr.success('Number Saved')
				})
			}
		},
		endpoint: {
			init: function(){
				Endpoints.list().then(function(list){
					$scope.endpoints = list;
				})
			},
			focus: function(endp){
				$scope.endpoint = angular.copy(endp) || {};
			},
			modal: function(endp){
				$scope.endpoint = {};
				$('#endpointModal').modal('show')
			},
			save: function(endp){
				Endpoints.save(endp).then(function(r){
					toastr.success('Endpoint Created')
					$scope.endpoints.push(r)
				})
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
			},
			forward: {
				addNumber: function(action){
					if(!action.numbers)
						action.numbers = [];
					if(String(action.number).length == 10)
						action.number = '1'+action.number
					if(String(action.number).length >= 11){
						action.numbers.push(action.number)
						delete action.number;
					}else{
						toastr.error('You must enter a number with an area code.')
					}
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
			},
			record: {
				modal: function(action){
					if(!action.record)
						action.record = {active: true, maxLength:60}
					$scope.action = action;
					$('#recordSettingsModal').modal('show');
				},
				toggle: function(action){
					action.record.active = !action.record.active
				},
				acl: function(){
					if(!$scope.action.record)
						$scope.action.record = {ACL: {}};
					Numbers.ACL.modal($scope.action.record, 'All recordings will be applied with the following rules.')
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
			add: function(parent, attr, item){
				if(!parent[attr])
					parent[attr] = []
				parent[attr].push(item)
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
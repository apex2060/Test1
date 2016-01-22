app.lazy.controller('TestCtrl', function($rootScope, $scope, $http, Parse, config){
	var Numbers = new Parse('PhoneNumbers');
	
	var tools = $scope.tools = {
		init: function(){
			Numbers.list().then(function(list){
				$scope.list = list;
			})
		},
		list: function(areaCode){
			$http.post(config.parse.root+'/functions/listPhoneNumbers', {
				pattern: areaCode
			}).success(function(data){
				$scope.numbers = data.result;
			})
		},
		register: function(number){
			Numbers.save({
				type: 	'phone',
				number:	number.number,
				city: 	number.rate_center,
				state: 	number.region
			}).then(function(d){
				alert('Saved')
			})
		}
	}
	tools.init();
	
	it.TestCtrl = $scope;
});
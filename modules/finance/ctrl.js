app.lazy.controller('PlaidTest', function($scope, $http, Auth, config) {

	var tools = $scope.tools = {
		plaid: function() {
			var plaid = Plaid.create({
				env: 'tartan',
				clientName: 'Client Name',
				key: 'test_key',
				product: 'auth',
				longTail: true,
				onLoad: function() {
					// The Link module finished loading.
				},
				onSuccess: function(public_token, metadata) {
					// Send the public_token to your app server here.
					// The metadata object contains info about the institution the
					// user selected and the account ID, if selectAccount is enabled.
					console.log(public_token, metadata)
					$http.post(config.parse.root + '/functions/plaidConnect', metadata).success(function(data) {
						$scope.plaid = data.result;
					})
				},
				onExit: function() {
					// The user exited the Link flow.
				}
			});
			plaid.open();
		},
		account: {
			focus: function(account){
				$scope.focus = account;
				if(account)
					$scope.search = {_account: account._id}
				else
					$scope.search = undefined;
			}
		}
	}

	it.PlaidTest = $scope;
});
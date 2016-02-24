app.lazy.controller('CommunicationCtrl', function($scope, $routeParams, $http, Auth, Cloudinary, config){

	var tools = $scope.tools = {
		init: function(){
			
		},
		view: function(view){
			if(view || !$scope.view)
				$scope.view = view || 'timeline';
			return '/modules/communication/views/'+$scope.view+'.html';
		},
		new: function(type){
			if(type == 'options' && $scope.newComm && $scope.newComm.show)
				$scope.newComm.show = false;
			else
				$scope.newComm = {
					show: true,
					type: type,
					data: {}
				}
		},
		addImage: function(item, attr){
			cloudinary.openUploadWidget({
				cloud_name: $scope.config.params.cloudinary.cloud_name,
				upload_preset: $scope.config.params.cloudinary.preset,
				theme: 'white',
				multiple: false,
			},
			function(error, result) {
				if (result)
					item[attr] = {
						etag: result[0].etag,
						public_id: result[0].public_id,
						secure_url: result[0].secure_url,
						thumbnail_url: result[0].thumbnail_url,
						url: result[0].url
					}
				$scope.$apply();
			});
		},
		fax: {
			send: function(data){
				$scope.sendFaxResult = {status: 'Processing...'};
				var request = {
					to: 				data.to,
					caller_id: 			data.from,
					header_text: 		data.subject,
					string_data: 		data.attachment.secure_url,
					string_data_type: 	'url'
				}
				
				
				$http.post(config.parse.root+'/functions/faxSend', request).success(function(data){
					$scope.fax = data.result;
				})
			}
		},
		snail: {
			postcard: function(data){
				var width = '2500'
				var height = '1700'
				var request = {
					description: 'Demo Postcard job',
					to: {
			 			name: 'Joe Smith',
			 			address_line1: '123 Main Street',
			 			address_city: 'Mountain View',
			 			address_state: 'CA',
			 			address_zip: '94041'
			 		},
			 		front: Cloudinary.resize(data.front.secure_url, width, height),
			 		back: Cloudinary.resize(data.back.secure_url, width, height)
				}
				$http.post(config.parse.root+'/functions/lobPostcard', request).success(function(data){
					$scope.snail = data.result;
				})
			}
		}
		// thread: function(id){
		// 	var request = gapi.client.gmail.users.threads.get({
		// 		'userId': 	'me',
		// 		'id': 		id
		// 	});
		
		// 	request.execute(function(resp) {
		// 		it.r = resp
		// 		$scope.thread = [];
		// 		resp.messages.forEach(function(message){
		// 			var msg = atob(message.payload.body.data.replace(/-/g, '+').replace(/_/g, '/') ); 
		// 			$scope.thread.push(msg)
		// 		})
		// 		$scope.$apply();
		// 	});
		// },
		// gmail: function(){
		// 	function listThreads() {
		// 		var request = gapi.client.gmail.users.threads.list({
		// 			'userId': 'me'
		// 		});
			
		// 		request.execute(function(data) {
		// 			$scope.threads = data.result.threads;
		// 			$scope.$apply();
		// 		});
		// 	}
		// 	Auth.tools.google.scopes('https://mail.google.com/').then(function(){
		// 		gapi.client.load('gmail', 'v1', listThreads);
		// 	})
		// }
	}
	tools.init();
	
	it.CommunicationCtrl = $scope;
});
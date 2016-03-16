/*
	Offline forms do not work with the following:
	- File Input
	- Image Input
*/
var it = {};
angular.module('offlineForms', [])
	.factory('config', function ($http, $q) {
		var config = {
			parse: {
				root: 		'https://api.parse.com/1',
				appId: 		'ETf61cYOebIkncxvVgrldjmPX4Z2acpWiKfY9wWM',
				jsKey: 		'i3MNq4GYuP6ays3LNQdijimLuaN5uOJst1n87bVy',
				restKey: 	'Wcpk6SaGnzklz5S0OhtngeYD6KJzNIoQ3VmyUgtK'
			},
			google: {
				"client_id": "821954483-q3ooncrbh8cmo8ukcupov77hfn41i6g9.apps.googleusercontent.com",
				"project_id": "easy-business-center",
				"auth_uri": "https://accounts.google.com/o/oauth2/auth",
				"token_uri": "https://accounts.google.com/o/oauth2/token",
				"auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
				"client_secret": "jG4FoLYpU6TC7Pfk9O3iZtJV",
				"redirect_uris": ["https://root-apex2060.c9users.io/oauth", "https://easybusiness.center/oauth", "http://easybusiness.center/oauth"],
				"javascript_origins": ["https://root-apex2060.c9users.io", "http://easybusiness.center", "https://easybusiness.center"],
			},
		}
		$http.defaults.headers.common['X-Parse-Application-Id'] = config.parse.appId;
		$http.defaults.headers.common['X-Parse-REST-API-Key'] = config.parse.restKey;
		$http.defaults.headers.common['Content-Type'] = 'application/json';
		return config;
	})
	.factory('Parse', function($rootScope, $http, $q, config){
		var Parse = function(className, immediate){
			var ds = this;
			ds.className = className;
			ds.immediate = immediate;
			ds.schema = function(){
				var deferred = $q.defer();
				$http.get(config.parse.root+'/schemas/'+ds.className).success(function(data){
					deferred.resolve(data.results)
				}).error(function(e){
					deferred.reject(e);
				})
				return deferred.promise;
			}
			ds.list = function(){
				var deferred = $q.defer();
				$http.get(config.parse.root+'/classes/'+ds.className).success(function(data){
					deferred.resolve(data.results)
				}).error(function(e){
					deferred.reject(e);
				})
				return deferred.promise;
			}
			ds.query = function(query){
				var deferred = $q.defer();
				$http.get(config.parse.root+'/classes/'+ds.className+query).success(function(data){
					deferred.resolve(data.results)
				}).error(function(e){
					deferred.reject(e);
				})
				return deferred.promise;
			}
			ds.get = function(objectId){
				var deferred = $q.defer();
				$http.get(config.parse.root+'/classes/'+ds.className+'/'+objectId).success(function(data){
					deferred.resolve(data)
				}).error(function(e){
					deferred.reject(e);
				})
				return deferred.promise;
			}
			ds.batch = function(arr){
				var deferred = $q.defer();
				var requests = arr.map(function(item){
					delete item.createdAt;
					delete item.updatedAt;
					if(item.objectId){
						var method = 'PUT'
						var path = '/1/classes/'+ds.className+'/'+item.objectId;
						delete item.objectId;
					}else{
						var method = 'POST'
						var path = '/1/classes/'+ds.className
					}
					return {
						method: method,
						path: path,
						body: item
					}
				})
				$http.post(config.parse.root+'/batch', {requests: requests}).success(function(data){
					deferred.resolve(data)
				}).error(function(e){
					deferred.reject(e);
				})
				return deferred.promise;
			}
			ds.save = function(object){
				if(!object.objectId)
					return ds.new(object)
				else
					return ds.update(object)
			}
			ds.new = function(object){
				var deferred = $q.defer();
				object = angular.copy(object);
				delete object.objectId
				delete object.updatedAt
				delete object.createdAt
				$http.post(config.parse.root+'/classes/'+ds.className, object).success(function(data){
					object = angular.extend(object, data);
					deferred.resolve(object)
				}).error(function(e){
					deferred.reject(e);
				})
				return deferred.promise;
			}
			ds.update = function(object){
				var deferred = $q.defer();
				var object2 = angular.copy(object);
				var objectId = object.objectId;
				delete object2.objectId
				delete object2.updatedAt
				delete object2.createdAt
				$http.put(config.parse.root+'/classes/'+ds.className+'/'+objectId, object2).success(function(data){
					object2 = angular.extend(object, data);
					deferred.resolve(object2)
				}).error(function(e){
					deferred.reject(e);
				})
				return deferred.promise;
			}
			ds.delete = function(object){
				var deferred = $q.defer();
				$http.delete(config.parse.root+'/classes/'+ds.className+'/'+object.objectId).success(function(data){
					deferred.resolve(data)
				}).error(function(e){
					deferred.reject(e);
				})
				return deferred.promise;
			}
			ds.ACL = {
				init: function(){
					if(!$rootScope.users){
						Auth.init().then(function(){
							$http.get(config.parse.root+'/classes/_User').success(function(data){
								$rootScope.users = data.results
							})
							$http.get(config.parse.root+'/classes/_Role').success(function(data){
								$rootScope.roles = data.results
							})
						});
					}
				},
				modal: function(object, message){
					object = object || {}
					var deferred = $q.defer();
					ds.ACL.init();
					$rootScope.ACL = {
						deferred: deferred,
						object: ds.ACL.unpack(object),
						message: message,
						tools: ds.ACL
					};
					$('#ACL').modal({
						keyboard: false,
						backdrop: 'static',
						show: true
					});
					return deferred.promise;
				},
				close: function(){
					var object = ds.ACL.pack($rootScope.ACL.object)
					$('#ACL').modal('hide');
					$rootScope.ACL.deferred.resolve(object)
				},
				add: function(type){
					if(!$rootScope.ACL.object.acl)
						$rootScope.ACL.object.acl = []
					$rootScope.ACL.object.acl.push({type:type})
				},
				remove: function(acl){
					var i = $rootScope.ACL.object.acl.indexOf(acl)
					$rootScope.ACL.object.acl.splice(i, 1)
				},
				verify: function(){
					//This will need to check to make sure the current user will still have access
					//If the current user will not have access, then prompt to see if they still 
					//want to set those permissions.
				},
				unpack: function(object){
					if(!object.ACL)
						return object;
					var keys = Object.keys(object.ACL)
					object.acl = [];
					keys.forEach(function(key){
						var acl = object.ACL[key]; //read write params
							acl.type = 'user';
						if(key.indexOf('*') != -1){
							acl.type = 'all';
							object.pAcl = acl;
						}else if(key.indexOf('role:') != -1){
							acl.type = 'role';
							key = key.replace('role:', '')
						}
						if(acl.type != 'all'){
							acl[acl.type] = key;
							object.acl.push(acl)
						}
					})
					return object;
				},
				pack: function(object){
					var acl = {'*':{},'role:Admin':{read:true,write:true}};
					if(!object.ACL)
						acl[Auth.objectId] = {
							read: true,
							write: true
						}
					if(object.pAcl){
						if(object.pAcl.read)
							acl['*'].read = object.pAcl.read
						if(object.pAcl.write)
							acl['*'].write = object.pAcl.write
					}
					if(object.acl)
						object.acl.forEach(function(item){
							if(item[item.type]){
								var extension = '';
								if(item.type == 'role')
									extension = 'role:'
								acl[extension+item[item.type]] = {};
								if(item.read)
									acl[extension+item[item.type]].read = item.read
								if(item.write)
									acl[extension+item[item.type]].write = item.write
							}
						})
					delete object.acl
					delete object.pAcl
					object.ACL = acl
					return object;
				}
			}
		}
		Parse.prototype.schema = function(){
			var deferred = $q.defer();
			$http.post('https://api.parse.com/1/functions/schema').success(function(data){
				deferred.resolve(data.result)
			})
			return deferred.promise;
		}
		return Parse;
	})
	.controller('FormsCtrl', function($scope, $http, $q, Parse){
		var Forms = new Parse('Forms');
		var Data = {};
		
		var tools = $scope.tools = {
			init: function(){
				tools.loadForms();
			},
			loadForms: function(){
				var offlineForms = localStorage.getItem('offlineForms');
				if(offlineForms){
					$scope.forms = angular.fromJson(offlineForms)
				}else{
					Forms.list().then(function(forms){
						$scope.forms = forms;
						localStorage.setItem('offlineForms', angular.toJson(forms));
					})
				}
				
			},
			loadFormData: function(form){
				form.offline = !form.offline;
				if(form.offline){
					tools.form.import(form.fields, {}).then(function(fields){
						form.fields = fields;
						$scope.orig = form;
						$scope.form = angular.copy(form);
						localStorage.setItem('offlineForm', angular.toJson(form));
					})
				}
			},
			form: {
				load: function(){
					// var deferred = $q.defer();
					// $timeout(function(){
					// 	if($routeParams.action=='fill'){
					// 		if($routeParams.id){
					// 			Forms.get($routeParams.id).then(function(form){
					// 				$scope.orig = form;
					// 				$scope.form = angular.copy(form);
					// 				Data = new Parse(form.name);
					// 				deferred.resolve($scope.form);
					// 			})
					// 		}else{
					// 			tools.form.new();
					// 		}
					// 	}
					// }, 1000)
					// return deferred.promise;
				},
				import: function(fields, data){
					var deferredFields = $q.defer();
					data = data || {};
					//Join data to fields to display properly.
					function format(field, data){
						var deferred = $q.defer();
						var format = {
							group: function(field){
								tools.form.import(field.fields, data).then(function(fields){
									field.fields = fields;
									deferred.resolve(field);
								})
								return deferred.promise;
							},
							date: function(field){
								var d = new Date()
								var m = d.getTimezoneOffset();
								if(data)
									field.value = moment(data.iso).add(m, 'minutes').toDate()
								deferred.resolve(field);
								return deferred.promise;
							},
							pointer: function(field){
								field.Data = new Parse(field.ptr.database);
								var query = field.ptr.query || '';
								field.Data.query(query).then(function(list){
									field.options = list;
									if(data)
										field.value = data.objectId
									deferred.resolve(field);
								})
								return deferred.promise;
							}
						}
						var formatOptions = Object.keys(format);
						if(formatOptions.indexOf(field.type) != -1){
							return format[field.type](field)
						}else{
							field.value = data;
							deferred.resolve(field);
							return deferred.promise;
						}
					}
					if(!fields)
						deferredFields.resolve([]);
					else{
						var promises = [];
						for(var i=0; i<fields.length; i++){
							promises.push((function(field, i){
								var deferred = $q.defer();
								field.data = data; //Allows us to refer to row data within the parsed text.
								
								
								if(field.array){
									var arr = data[field.name];
									var promises = [];
									if(arr){
										for(var i=0; i<arr.length; i++)
											promises.push((function(field, data){
												var f = angular.copy(field);
												delete f.array;
												var formated = format(f, data);
												return formated;
											})(field, arr[i]))
										$q.all(promises).then(function(values){
											field.value = values;
											deferred.resolve(field);
										})
									}else{
										field.value = [];
										deferred.resolve(field);
									}
									return deferred.promise;
								}else{
									return format(field, data[field.name])
								}
							})(fields[i], i))
						}
						$q.all(promises).then(function(fields){
							deferredFields.resolve(fields);
						})
					}
					return deferredFields.promise;
				},
				export: function(fields){
					function format(field){
						var format = {
							group: function(field){
								return tools.form.export(field.fields);
							},
							pointer: function(field){
								if(!field.value)
									return null;
								return {
									__type: 	'Pointer',
									className: 	field.ptr.database,
									objectId: 	field.value
								}
							},
							file: function(field){
								//update all permissions
								if(field.value){
									field.value.forEach(function(file){
										field.permissions.forEach(function(permission){
											Google.drive.permission.set(file.id, permission).then(function(r){
												toastr.success('Files Shared.')
											}, function(e){
												toastr.error('Some files were not shared correctly.')
											})
										})
									})
								}
								return field.value;
							},
							date: function(field){
								var d = new Date()
								var m = d.getTimezoneOffset();
								return {
									__type: 	'Date',
									iso: 		moment(field.value).subtract(m, 'minutes').toDate()
								}
							}
						}
						var formatOptions = Object.keys(format);
						if(formatOptions.indexOf(field.type) != -1)
							return format[field.type](field)
						else
							return field.value;
					}
					var data = {}
					for(var i=0; i<fields.length; i++){
						(function(field){
							if(field.array){
								var arr = [];
								for(var i=0; i<field.value.length; i++){
									console.log('array', field.value[i])
									arr.push(format(field.value[i]))
								}
								data[field.name] = arr;
							}else{
								data[field.name] = format(field)
							}
						})(fields[i])
					}
					return data;
				},
				save: function(){
					var form = $scope.form;
					var data = tools.form.export(form.fields);
					var request = {
						formId: form.objectId,
						dataId: data.objectId, //TODO NEEDS WORK
						data: 	data
					}
					var localData = localStorage.getItem('offlineData') || {};
					if(typeof(localData) != 'object')
						localData = angular.fromJson(localData)
					if(!localData[form.objectId])
						localData[form.objectId] = [];
					localData[form.objectId].push(request);
					localStorage.setItem('offlineData', angular.toJson(localData));
					alert('Saved Locally');
					// $http.post('https://api.parse.com/1/functions/formSubmit', request).success(function(data){
					// 	$scope.data.objectId = data.result.objectId
						if(!form.onSubmit)
							form.onSubmit = {};
					// 	var message = $scope.form.onSubmit.message || 'Form Saved!'
					// 	toastr.success(message)
							
						if(form.onSubmit.link)
							window.location = form.onSubmit.link
						else
							tools.form.end.modal();
					// })
				},
				end: {
					modal: function(form){
						$('#endOptions').modal('show');
					},
					continue: function(){
						$scope.form = angular.copy($scope.orig);
						tools.form.import($scope.form.fields, $scope.data).then(function(fields){
							$scope.form.fields = fields;
							$('#endOptions').modal('hide');
						})
					},
					keepData: function(){
						delete $scope.data.objectId;
						$('#endOptions').modal('hide');
					},
					clearAll: function(){
						$scope.data = {};
						$scope.form = angular.copy($scope.orig);
						tools.form.import($scope.form.fields, {}).then(function(fields){
							$scope.form.fields = fields;
						})
						$('#endOptions').modal('hide');
					},
				}
			},
			item: {
				id: function($parent){
					var name = '';
					while($parent && $parent.$parent){
						name+=$parent.$id
						$parent = $parent.$parent;
					}
					return name;
				},
				pointer: function(field){
					// console.log('a',field)
				},
				remove: function(parent, item){
					parent.splice(parent.indexOf(item), 1)
				},
				addFiles: function(item){
					item.value = item.value || [];
					var ol = angular.copy(item.value)
					
					Google.drive.picker.generate(10).then(function(data){
						ol = ol.concat(data.docs)
						item.value = angular.extend(item.value, ol)
					})
				},
				addImages: function(item){
					cloudinary.openUploadWidget({
						cloud_name: $scope.config.params.cloudinary.cloud_name,
						upload_preset: $scope.config.params.cloudinary.preset,
						theme: 'white',
						multiple: false,
					},
					function(error, result) {
						if (result)
							item.value = {
								etag: result[0].etag,
								public_id: result[0].public_id,
								secure_url: result[0].secure_url,
								thumbnail_url: result[0].thumbnail_url,
								url: result[0].url
							}
						$scope.$apply();
					});
				},
				addArr: function(field){
					var instance = angular.copy(field);
					delete instance.array;
					delete instance.value;
					if(!Array.isArray(field.value))
						field.value=[];
					tools.form.import([instance], {}).then(function(fields){
						field.value.push(fields[0]);
					})
				}
			},
			random: {
				// interpolate: function(template, scope){
				// 	// return $interpolate(template)(scope)
				// },
			}
		}
		
		tools.init();
		
		it.FormsCtrl = $scope;
	})
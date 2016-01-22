app.lazy.controller('AdminFormsCtrl', function($scope, $http, $timeout, $routeParams, Data, Google) {
	var Forms = Data('Forms');
	$scope.tools = {
		view: function(){
			var a = $routeParams.action || 'list';
			return 'modules/admin/forms/'+a+'.html';
		}
	}
	Forms.tools.list().then(function(list){
		$scope.forms = list;
	})
	it.AdminFormsCtrl = $scope;
});

app.lazy.controller('AdminFormsCreateCtrl', function($scope, $http, $timeout, $routeParams, Data, Auth, Google) {
	var Forms = Data('Forms');
	var Users = Data('_User');
	
	//The following variables make it possible to work with nested input groups.
	var ePromise;
	var clicked = [];

	var formTemplate = {
		title: 		'Untitled Form',
		type: 		'form',
		name: 		'ud_unassigned',
		fields: 	[],
	}
	var fieldOptions = $scope.fieldOptions = [
		{
			title:      'Header',
			type:       'header',
			p: 			'Paragraph Text',
			files: 		[],
			enabled: 	true
		},{
			title:      'Group',
			name: 		'columnName',
			p:			'Paragraph Text',
			type:       'group',
			dataType:   'Object',
			fields: 	[],
			enabled: 	true
		},{
			title:      'Text Line',
			name: 		'columnName',
			placeholder:'Placeholder for Text',
			type:       'text',
			dataType:   'String',
			enabled: 	true
		},{
			title:      'Text Area',
			name: 		'columnName',
			placeholder:'Placeholder for Text',
			type:       'textarea',
			dataType:   'String',
			enabled: 	true
		},{
			title:      'Select Input',
			name: 		'columnName',
			type:       'select',
			dataType:   'Pointer',
			parseClass: 'unassigned',
			parseQuery: '',
			enabled: 	true
		},{
			title:      'Pointer',
			name: 		'columnName',
			placeholder:'Placeholder for Text',
			type:       'pointer',
			dataType:   'Pointer',
			enabled: 	true
		},{
			title:      'Number Input',
			name: 		'columnName',
			placeholder:'Placeholder for Number',
			type:       'number',
			dataType:   'Number',
			enabled: 	true
		},{
			title:      'Date Time',
			name: 		'columnName',
			placeholder:'Placeholder for Date',
			type:       'date',
			dataType:   'Date',
			enabled: 	true
		},{
			title:      'Check Box',
			name: 		'columnName',
			placeholder:'Placeholder for Checkbox',
			type:       'checkbox',
			dataType:   'Boolean',
			enabled: 	true
		},{
			title:      'Geo Point',
			name: 		'columnName',
			placeholder:'Placeholder for Geo Point',
			type:       'geoPoint',
			dataType:   'GeoPoint',
			enabled: 	false
		},{
			title:      'File Input',
			name: 		'columnName',
			type:       'file',
			dataType:   'Object',
			enabled: 	true
		},{
			title:      'Signature Input',
			name: 		'columnName',
			type:       'signature',
			dataType:   'Object',
			enabled: 	true
		}
	]
	
	var tools = $scope.tools = {
		init: function(){
			$timeout(function(){
				if($routeParams.action=='create'){
					if($routeParams.id){
						Forms.tools.byId($routeParams.id).then(function(form){
							$scope.form = angular.copy(form);
						})
					}else{
						tools.form.new();
					}
				}
			}, 1000);
			$scope.$watch('form.name', function(newValue, oldValue){
				if($scope.user && !$scope.user.is('Admin')){
					if(newValue && newValue.substring(0,3) != 'ud_')
						$scope.form.name = 'ud_'+newValue
				}
			}, true)
		},
		item: {
			add: function(parent, attr, item){
				console.log('adddd')
				parent[attr] = parent[attr] || [];
				parent[attr].push(item)
			},
			copy: function(){
				
			},
			remove: function(parent, item){
				parent.splice(parent.indexOf(item), 1)
			},
			focus: function(field){
				$timeout.cancel(ePromise);
				clicked.push(field);
				ePromise = $timeout(function(){
					$scope.focus = clicked[0];
					if(clicked.length >  1)
						$scope.fParent = clicked[1];
					clicked = [];
				}, 100)
			},
			addFiles: function(item){
				item.files = item.files || [];
				var ol = angular.copy(item.files)
				Google.drive.picker.generate(10).then(function(data){
					ol = ol.concat(data.docs)
					item.files = angular.extend(item.files, ol)
				})
			}
		},
		form: {
			new: function(){
				$scope.form = angular.copy(formTemplate);
				$scope.fParent = $scope.form;
			},
			save: function(){
				Forms.tools.save($scope.form).then(function(form){
					$scope.form = form;
				})
			}
		},
		field: {
			add: function(field){
				if(!$scope.fParent)
					$scope.fParent = $scope.form;
				$scope.fParent.fields.push( angular.copy(field) );
			},
		},
		modal: function(id){
			$('#'+id).modal('show');
		}
	}
	
	Auth.init().then(function(){
		Forms.tools.list().then(function(list){
			$scope.forms = list;
			tools.init();
		})
		Users.tools.list().then(function(list){
			$scope.users = list;
		})
	})
	
	it.AdminFormsCreateCtrl = $scope;
});

app.lazy.controller('AdminFormsFillCtrl', function($scope, $http, $timeout, $q, $routeParams, $interpolate, Parse, Google) {
	var Forms = new Parse('Forms');
	var Data = null;
	$scope.data = {};
	
	var tools = $scope.tools = {
		init: function(){
			tools.form.load().then(function(form){
				if($routeParams.for){
					Data.get($routeParams.for).then(function(data){
						$scope.data = data;
						tools.form.import(form.fields, data).then(function(fields){
							form.fields = fields;
						})
					})
				}else{
					tools.form.import(form.fields, {}).then(function(fields){
						form.fields = fields;
					})
				}
			})
		},
		form: {
			load: function(){
				var deferred = $q.defer();
				$timeout(function(){
					if($routeParams.action=='fill'){
						if($routeParams.id){
							Forms.get($routeParams.id).then(function(form){
								$scope.form = angular.copy(form);
								Data = new Parse(form.name);
								deferred.resolve($scope.form);
							})
						}else{
							tools.form.new();
						}
					}
				}, 1000)
				return deferred.promise;
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
							field.value = moment(data).toDate();
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
						console.log('field', field)
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
				$scope.data = angular.merge($scope.data, data);
				var request = {
					formId: form.objectId,
					dataId: $scope.data.objectId,
					data: 	$scope.data
				}
				console.log(request)
				$http.post('https://api.parse.com/1/functions/formSubmit', request).success(function(resp){
					alert('saved!')
				})
				// Data.save($scope.data).then(function(data){
				// 	$scope.data = data;
				// 	alert('Saved!')
				// })
			}
		},
		item: {
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
			interpolate: function(template, scope){
				return $interpolate(template)(scope)
			},
		}
	}
	
	Forms.list().then(function(list){
		$scope.forms = list;
		tools.init()
	})
	
	it.AdminFormsFillCtrl = $scope;
});

//any input group should be able to insert it's contents into an array of data instead of just a single object.
//Input Group
//[] As Array
//[] Allow History Edit
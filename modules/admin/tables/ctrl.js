app.lazy.controller('AdminTableCtrl', function($scope, $routeParams, $interpolate, $http, Auth, Parse){
	$scope.rp = $routeParams;
	if($routeParams.id){
		var tableId = $routeParams.id
		var Data = new Parse(tableId)
	}
	
	var tableColumns = localStorage.getItem('tableColumns') || '{}'
	tableColumns = angular.fromJson(tableColumns);
	
	var colTemplates = $scope.colTemplates = [{
		title: 		'Text',
		name: 		'text',
		dataType: 	'String'
	},{
		title: 		'Date 1',
		name: 		'rDate',
		dataType: 	'Date'
	},{
		title: 		'Date 2',
		name: 		'cDate',
		dataType: 	'Date'
	},{
		title: 		'Date 3',
		name: 		'aDate',
		dataType: 	'Date'
	},{
		title: 		'Signature',
		name: 		'signature',
		dataType: 	'Object'
	},{
		title: 		'Pointer',
		name: 		'pointer',
		dataType: 	'Pointer'
	},{
		title: 		'Number',
		name: 		'number',
		dataType: 	'Number'
	},{
		title: 		'Object',
		name: 		'object',
		dataType: 	'Object'
	},{
		title: 		'Link',
		name: 		'link',
		link: 		'https://www.google.com/#q={columnName}'
	}]
	
	
	var tools = $scope.tools = {
		init: function(){
			tools.table.init();
		},
		table: {
			init: function(){
				var columns = {};
				Data.list().then(function(list){
					$scope.columns 	= tools.table.columns(list);
					$scope.list 	= list;
				})
				$scope.$watch('columns', function(newValue){
					if(newValue){
						tableColumns[tableId] = newValue;
						localStorage.setItem('tableColumns', angular.toJson(tableColumns))
					}
				}, true)
			},
			columns: function(list){
				var columns = tableColumns[tableId] || tools.object.keys(list).map(function(key){
					return {name:key}
				})
				return columns
			},
			reset: function(){
				tableColumns[tableId] = false;
				$scope.columns = tools.table.columns($scope.list);
			}
		},
		column: {
			focus: function(column){
				//show modal to manipulate column information
				$scope.focus = column;
				$('#colModal').modal('show')
			},
			add: function(params){
				if(!params)
					params = prompt('Enter Column Name (no spaces or special chars)');
				if(typeof(params) == 'string')
					params = {
						name: params
					}
				$scope.columns.push(params);
			},
			remove: function(column){
				if(confirm('Are you sure you want to remove this column?')){
					var i = $scope.columns.indexOf(column);
					$scope.columns.splice(i,1)
				}
			},
			template: function(column){
				if(column && column.template)
					return column.template.name+'.templateCol'
			}
		},
		cell: {
			focus: function(cell){
				var columns = tools.object.keys(cell);
				var focus = $scope.focus = {
					type: tools.object.type(cell),
					columns: tools.object.keys(cell),
				}
				if(focus.type == 'Object')
					focus.list = [cell]
				else if(focus.type == 'Array')
					focus.list = cell
				$('#deepDive').modal('show')
			},
			template: function(col, row){
				if(col.name == 'objectId')
					return 'noedit.templateCell'
				if(col.template)
					return col.template.name+'.templateCell'
				else
					return 'default.templateCell'
			}
		},
		object: {
			keys: function(obj){
				var keys = [];
				if(obj instanceof Array){
					for(var i=0; i<obj.length; i++)
						keys = keys.concat(Object.keys(obj[i]))
					keys = keys.getUnique();
				}else if(obj instanceof Object){
					keys = Object.keys(obj)
				}
				return keys;
			},
			type: function(obj){
				if(obj instanceof Array)
					return 'Array'
				else if(obj instanceof Object)
					return 'Object'
				else
					return typeof(obj)
			}
		},
		random: {
			interpolate: function(template, scope){
				return $interpolate(template)(scope)
			},
			compile: function(type, col, row){
				if(type == 'link' && col.template.format && row)
					return $interpolate(col.template.format)(row)
				else if(type == 'rDate')
					return moment(row[col.name]).fromNow()
				else if(type == 'cDate')
					return moment(row[col.name]).calendar()
				else if(type == 'aDate')
					return moment(row[col.name]).format("MMM Do YYYY, h:mm:ss a");
			}
		}
	}
	tools.init();
	
	it.AdminTableCtrl = $scope;
});

//{{ observations | map:"location" }}
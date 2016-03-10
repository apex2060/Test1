app.lazy.controller('AdminTableCtrl', function($scope, $routeParams, $interpolate, $compile, $timeout, $http, Auth, Parse){
	var Forms = new Parse('Forms');
	$scope.rp = $routeParams;
	if($routeParams.id){
		var tableId = $routeParams.id
		var Data = new Parse(tableId)
	}
	
	var tableColumns = localStorage.getItem('tableColumns') || '{}'
	tableColumns = angular.fromJson(tableColumns);
	
	var colTemplates 	= $scope.colTemplates 	= [{
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
	var mergeTypes 		= $scope.mergeTypes 	= ['table','file','plain']

	var tools = $scope.tools = {
		init: function(){
			// tools.grid();
			Forms.query('?where={"name":"'+tableId+'"}').then(function(list){
				$scope.forms = list;
				tools.table.init();
			})
		},
		grid: function(){
			// var columns = [
			//     {id: "title", name: "Title", field: "title"},
			//     {id: "duration", name: "Duration", field: "duration"},
			//     {id: "%", name: "% Complete", field: "percentComplete", sortable:true},
			//     {id: "start", name: "Start", field: "start"},
			//     {id: "finish", name: "Finish", field: "finish"},
			//     {id: "effort-driven", name: "Effort Driven", field: "effortDriven"}
			//   ];
			//   var options = {
			//     enableCellNavigation: true,
			//     enableColumnReorder: false
			//   };
			  
			    // var data = [];
			    // for (var i = 0; i < 500; i++) {
			    //   data[i] = {
			    //     title: "Task " + i,
			    //     duration: "5 days",
			    //     percentComplete: Math.round(Math.random() * 100),
			    //     start: "01/01/2009",
			    //     finish: "01/05/2009",
			    //     effortDriven: (i % 5 == 0)
			    //   };
			    // }
			    
			//     $scope.grid = {
			//     	columns: columns,
			//     	options: options,
			//     	data: data
			//     }
			  
		},
		row: {
			save: function(n){
				var item = $scope.grid.api.getDataItem(n);
				delete item._dirty
				$scope.grid.api.updateRow(item);
				Data.save(item).then(function(s){
					$scope.notify('success','Item Saved!');
				}, function(e){
					$scope.notify('error', e.error);
				})
			},
			remove: function(n){
				var item = $scope.grid.api.getDataItem(n);
				if(confirm('Are you sure you want to delete this?'))
					if(!item.objectId)
						$scope.grid.api.invalidateRow(n)
					else
						Data.delete(item).then(function(){
							$scope.grid.api.invalidateRow(n)
						}, function(e){
							$scope.notify('error', 'Error removing item')
						})
			},
			form: function(n){
				var item = $scope.grid.api.getDataItem(n);
				$scope.focus = item;
				$('#formModal').modal('show')
				// show modal to open with a form.
			}
		},
		data: {
			save: function(){
				if($scope.grid.changed.length)
					$timeout(function(){
						var items = $scope.grid.changed.splice(0, 50);
							items = items.map(function(item){delete item._dirty; return item})
						Data.batch(items).then(function(){
							$scope.notify('info', 'Items Saved. '+$scope.grid.changed.length+' items remaining.')
							tools.data.save()
						}, function(e){
							$scope.notify('error', e.error)
							tools.data.save();
						})
					}, 500)
				else
					$scope.notify('success', 'Everything saved.')
			}
		},
		table: {
			init: function(oList){
				if(!oList)
					oList = [];
				var columns = {};
				Data.query('?limit=1000&skip='+oList.length).then(function(list){
					oList = oList.concat(list)
					if(list.length == 1000){
						tools.table.init(oList);
					}else{
						$scope.columns 	= tools.table.columns(oList);
						$scope.list 	= oList;
						tools.table.setup($scope.columns, $scope.list);
					}
				})
			},
			setup: function(columns, data){
				columns = angular.copy(columns);
				columns.push({
					id: 'options',
					name: 'Options',
					formatter: function(r,c,v,cd,dc){
						var html = ''
						if(dc._dirty)
							html += '<button class="btn btn-success btn-xs" type="button" ng-click="tools.row.save('+r+')"><i class="fa fa-check"></i></button>'
							html += '<button class="btn btn-info btn-xs" type="button" ng-click="tools.row.form('+r+')"><i class="fa fa-file-text"></i></button>'
							html += '<button class="btn btn-danger btn-xs" type="button" ng-click="tools.row.remove('+r+')"><i class="fa fa-trash"></i></button>'
						return html
					},
					asyncPostRender: function(cellNode, row, dataContext, colDef){
						var scope = angular.extend($scope, {data:dataContext})
						var interpolated = $interpolate($(cellNode).html())(scope);
						var linker = $compile(interpolated);
						var htmlElements = linker(scope);
						$(cellNode).empty()
						$(cellNode).append(htmlElements);
					}
				})
				if(!$scope.grid)
					$scope.grid = {options: {
						editable: 				true,
						enableCellNavigation: 	true,
						asyncEditorLoading: 	true,
						enableAsyncPostRender: 	true
					}};
				$scope.grid.columns = columns
				$scope.grid.data = data
			},
			columns: function(list){
				var notAllowed = ['$$hashKey','objectId','updatedAt','createdAt','_dirty']
				function checkType(key, i){
					if(list[i] && list[i][key])
						return {type: typeof(list[i][key]), value: list[i][key]}
					else if(list[++i])
						return checkType(key, i)
					else
						return 'unknown';
				}
				
				var columns = tools.object.keys(list).map(function(key, i){
					var example = checkType(key, 0)
					if(example.type=='string')
						return {id:i,field:key,name:key,editor:Slick.Editors.Text}
					else if(example.type=='number')
						return {id:i,field:key,name:key,editor:Slick.Editors.Integer}
					else if(example.type=='boolean')
						return {id:i,field:key,name:key,editor:Slick.Editors.Checkbox}
					else if(example.type=='object')
						if(example.value.__type=='Date')
							return {id:i,field:key,name:key,editor:Slick.Editors.Date}
						else
							return {id:i,field:key,name:key}
					else
						return {id:i,field:key,name:key}
				}).filter(function(col){
					if(!col)
						return false;
					
					return notAllowed.indexOf(col.name) == -1
				})
				return columns
			},
			reset: function(){
				tableColumns[tableId] = false;
				$scope.columns = tools.table.columns($scope.list);
			},
			migrate: function(settings){
				var NewData = new Parse(settings.name);
				var status = 0;
				for(var i=0; i<$scope.list.length; i++)
					(function(item){
						item = angular.copy(item);
						var oldId = item.objectId;
						delete item.objectId;
						delete item.createdAt;
						delete item.updatedAt;
						NewData.save(item).then(function(result){
							toastr.success(oldId+' coppied to: '+settings.name+' as: '+result.objectId)
							$scope.migrationStatus = ++status/$scope.list.length*100
						})
					})($scope.list[i])
			},
			export: function(){
				var table = [];
				var cols = angular.copy($scope.columns);
					cols.unshift({name:'objectId'})
					table.push(cols.map(function(col){return col.title || col.name}))
				$scope.list.forEach(function(r){
					var row = []
					cols.forEach(function(col, i){
						row[i] = r[col.name]
					})
					table.push(row)
				})
				var csvContent = "data:text/csv;charset=utf-8,";
				table.forEach(function(infoArray, index) {
					var dataString = infoArray.join(",");
					csvContent += index < table.length ? dataString + "\n" : dataString;
				});
				var encodedUri = encodeURI(csvContent);
				window.open(encodedUri);
			}
		},
		column: {
			focus: function(column){
				//show modal to manipulate column information
				if(!column.title)
					column.title = column.name;
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
				if(col){
					if(col.name == 'objectId')
						return 'noedit.templateCell'
					if(col.template)
						return col.template.name+'.templateCell'
					else
						return 'default.templateCell'
				}
			}
		},
		merge: {
			init: function(){
				if(!$scope.merge)
					$scope.merge = {addNew: true};
				$('#mergeModal').modal('show')
				Parse.prototype.schema().then(function(schema){
					$scope.schema = schema
				})
			},
			loadFile: function(file){
				$scope.merge.json = file.src.csvToJson()
				tools.merge.display();
				$scope.$apply();
			},
			display: function(){
				if($scope.merge){
					var merge = $scope.merge
					var leftCols = $scope.columns.map(function(col){return col.name;})
						leftCols.push('objectId')
					if(merge.type == 'table')
						var rightCols = Object.keys(merge.db.fields)
					if(merge.type == 'file')
						var rightCols = tools.object.keys(merge.json)
						
						leftCols 	= leftCols.filter(function(col){return col!='createdAt' && col!='updatedAt'})
						rightCols 	= rightCols.filter(function(col){return col!='createdAt' && col!='updatedAt'})
					var joinCols 	= leftCols.filter(function(col){return rightCols.indexOf(col) != -1;})
						leftCols 	= leftCols.filter(function(col){return joinCols.indexOf(col) == -1;})
						rightCols 	= rightCols.filter(function(col){return joinCols.indexOf(col) == -1;})
						joinCols 	= joinCols.map(function(col){
							return {left:col,right:col,loose:true}
						})
					$scope.merge.columns = {
						left: leftCols,
						join: joinCols,
						right: rightCols
					}
				}
			},
			rJoin: function(col){
				var cols = $scope.merge.columns;
				if(col.left)
					cols.left.push(col.left)
				if(col.right)
					cols.right.push(col.right)
				cols.join.splice(cols.join.indexOf(col), 1);
			},
			join: function(s,e){
				var mc = $scope.merge.columns;
				e = mc[s].splice(mc[s].indexOf(e), 1)[0];
				mc.join.forEach(function(col){
					if(!col[s]){
						col[s] = e;
						e = null;
					}
				})
				if(e){
					var obj = {};
					obj[s] = e;
					mc.join.push(obj);
				}
			},
			remove: function(parent, child){
				parent.splice(parent.indexOf(child), 1)
			},
			act: function(){
				var merge 	= $scope.merge;
				var left 	= $scope.list;
				var right 	= merge.json;
				var cols 	= merge.columns;
				function smash(orig, nuevo, cols){
					cols.forEach(function(col){
						orig[col] = nuevo[col]
					})
					return orig;
				}
				function join(){
					var newList = [];
					left.forEach(function(lItem, i, lArr){
						var match = right.find(function(rItem){
							var found = true;
							cols.join.forEach(function(m){
								// console.log(lItem, rItem)
								// console.log(lItem[m[0]], rItem[m[1]])
								if( (true || m.loose) && (lItem[m.left] && rItem[m.right]) ){
									if(lItem[m.left].toLowerCase().replace(/ /g, '') != rItem[m.right].toLowerCase().replace(/ /g, ''))
										found = false;
								}else{
									if(lItem[m.left] != rItem[m.right])
										found = false;
								}
							})
							return found;
						})
						if(match){
							var prod = smash({_dirty:true}, lItem, cols.join.map(function(c){return c.left}))
							prod = smash(prod, lItem, cols.left)
							prod = smash(prod, match, cols.right)
							right.splice(right.indexOf(match), 1)
							newList.push(prod);
						}else if(!merge.removeOld){
							cols.right.map(function(col){lItem[col] = lItem[col] || null})
							newList.push(lItem);
						}
					})
					if(merge.addNew){
						newList = newList.concat(right.map(function(item){
							item._dirty = true;
							cols.join.forEach(function(c){
								item[c.left] = item[c.right];
								delete item[c.right]
							})
							return item;
						}));
					}
					it.join = newList;
					return newList;
				}
				var list = join();
				tools.table.setup(tools.table.columns(list), list)
			}
		},
		object: {
			keys: function(obj){
				var keys = [];
				var length = obj.length;
					if(length > 10)
						length = 10;
						
				if(obj instanceof Array){
					for(var i=0; i<length; i++)
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
		},
		modal: function(id){
			$('#'+id).modal('show');
		}
	}
	tools.init();
	
	it.AdminTableCtrl = $scope
});

//{{ observations | map:"location" }}
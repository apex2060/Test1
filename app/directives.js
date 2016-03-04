app.directive('drawer', ['$timeout', function($timeout) {
	return {
		restrict: 'E',
		link: function(scope, elm, attrs, ctrl) {
			scope.drawer = {
				partial: 	'partials/generic.html',
				height: 	'300px',
				visable: 	false
			};
			
			if(attrs.visable != undefined)
				scope.drawer.visable = attrs.visable;
				
			attrs.$observe('visable', function(value) {
				console.log('visable',value);
			});
		},
		templateUrl: 'static/drawer.html',
		replace: true
	};
}]);

app.directive('signature', function(){
	return {
		restrict: 'E',
		replace: true,
		template:	'<div style="position:relative;">'+
						'<div class="signature"><span>Sign On Line</span> | <a ng-click="signature.clear()">Clear Signature</a></div>'+
					 	''+
					'</div>',
		require: "ngModel",
		link: function(scope, ele, attrs,  ngModel){
			var signature = {};
			var sig = ele.children()[0];
			$(sig).jSignature();
			ngModel.$render = function() {
				return scope.signature.load(ngModel.$viewValue);
			};
			$(sig).bind('change', function(e){
				/* 'e.target' will refer to div with "#signature" */ 
				var datapair = $(sig).jSignature("getData", "svgbase64") 
				var src = "data:" + datapair[0] + "," + datapair[1]
					datapair = $(sig).jSignature("getData","base30") 
				
				signature = {
					type: 		'signature',
					date: 		new Date(),
					src: 		src,
					datapair: 	datapair,
				};
				ngModel.$setViewValue(signature);
			})
			scope.signature = {
				load: function(signature){
					if(signature)
						$(sig).jSignature("setData", "data:" + signature.datapair.join(",")) 
				},
				clear: function(){
					$(sig).jSignature("reset");
					signature = {};
					ngModel.$setViewValue(signature);
				},
			}
		}
	}
})
app.directive('map', ['GeoService', function(GeoService){
	return {
		restrict: 'E',
		replace: true,
		scope: {
			callback: '='
		},
		link:function (scope, elem, attr){
			/*SETUP DEFAULT VARIABLES FOR DIRECTIVE*/
			scope.config = {
				selectors: new Array('MARKER','CIRCLE', 'RECTANGLE'),
				color: '#1E90FF',
				zoom: 15,
				initmarker: false,
				advanced:false
			}

			/*OVERRIDE DEFAULTS IF PROVIDED*/
			if(attr.selectors)
				scope.config.selectors = attr.selectors.split('|');
			if(attr.color)
				scope.config.color = attr.color;
			if(attr.zoom)
				scope.config.zoom = Number(attr.zoom);
			if(attr.initmarker)
				scope.config.initmarker = attr.initmarker;
			if(attr.advanced)
				scope.config.advanced = attr.advanced;

			/*THESE CONSTANTS ARE REQUIRED*/
			scope.consts = {
				modes: [],
				currentShape:false
			};

			//Setup interaction
			$(scope.config.selectors).each(function(index, elem){
				scope.consts.modes.push(google.maps.drawing.OverlayType[elem]);
			});

			//Important Functions
			function normalizeShape(geoShape){
				var normalized = {};
				if(geoShape.type=='circle'){
					normalized={
						"type": "circle",
						"latitude": geoShape.getCenter().lat(),
						"longitude": geoShape.getCenter().lng(),
						"radius": Math.round(geoShape.getRadius()) / 1000
					}
				}else if(geoShape.type=='rectangle'){
					normalized = {
						"type": "rectangle",
						"northEast":{
							"latitude": geoShape.getBounds().getNorthEast().lat(),
							"longitude": geoShape.getBounds().getNorthEast().lng()
						},
						"southWest":{
							"latitude": geoShape.getBounds().getSouthWest().lat(),
							"longitude": geoShape.getBounds().getSouthWest().lng()
						}
					}
				}else if(geoShape.type=='marker'){
					normalized={
						"type": "marker",
						"latitude": geoShape.getPosition().lat(),
						"longitude": geoShape.getPosition().lng()
					}
				}
				return normalized;
			}
			function returnResults(newShape){
				if(typeof(scope.callback)=='function'){
					if(scope.config.advanced)
						scope.callback(newShape);
					else
						scope.callback(normalizeShape(newShape))
				}
			}

			GeoService.location().then(function(geo){
				scope.geo=geo;
				var mapOptions = {
					center: new google.maps.LatLng(geo.coords.latitude,geo.coords.longitude),
					zoom: scope.config.zoom
				};
				scope.map = new google.maps.Map(elem[0],mapOptions);

				var polyOptions = {
					strokeWeight: 0,
					fillOpacity: 0.45,
					editable: false
				};
				drawingManager = new google.maps.drawing.DrawingManager({
					drawingControlOptions: {
						position: google.maps.ControlPosition.TOP_CENTER,
						drawingModes: scope.consts.modes
					},
					drawingMode: scope.consts.modes[0],
					rectangleOptions: polyOptions,
					circleOptions: polyOptions,
					map: scope.map
				});
				

				google.maps.event.addListener(drawingManager, 'overlaycomplete', function(e) {
					scope.deleteOld();
					var newShape = e.overlay;
						newShape.type = e.type;
						scope.setCurrent(newShape);
						returnResults(newShape)
				});

				if(scope.config.initmarker){
					scope.consts.currentShape = new google.maps.Marker({
						type: 'marker',
						map:scope.map,
						animation: google.maps.Animation.DROP,
						position: mapOptions.center
					});
					returnResults(scope.consts.currentShape)
				}

				var rectangleOptions = drawingManager.get('rectangleOptions');
				rectangleOptions.fillColor = scope.config.color;
				drawingManager.set('rectangleOptions', rectangleOptions);

				var circleOptions = drawingManager.get('circleOptions');
				circleOptions.fillColor = scope.config.color;
				drawingManager.set('circleOptions', circleOptions);
			})
			scope.setCurrent=function setCurrent(shape) {
				scope.consts.currentShape = shape;
			}
			scope.deleteOld=function deleteOld() {
				if (scope.consts.currentShape) {
					scope.consts.currentShape.setMap(null);
				}
			}
		}
	}
}]);
app.directive('mediaManager', function() {
	return {
		restrict: 'A',
		replace: true,
		transclude: true,
		template:	'<div>'+
				 		'<input type="file" class="hidden" accept="image/*" capture="camera">'+
						'<div ng-transclude></div>'+
					'</div>',
		scope: {
			callback: 	'=mediaManager',
			parent: 	'=parent'
		},
		link: function(scope, elem, attrs, ctrl) {

			if(typeof(scope.callback)!='function'){
				console.error('mediaManager: no callback defined.',scope.callback)
				return;
			}

			processDragOverOrEnter = function(event) {
				if (event != null) {
					event.preventDefault();
				}
				event.originalEvent.dataTransfer.effectAllowed = 'copy';
				return false;
			};


			elem.bind('click', function(e){
				//At some point, this may end up being a call to open a modal which links to the media list
				$(elem).children('input')[0].click()
			});

			elem.bind('change', function(e) {
				var file, name, reader, size, type;
				if (e != null) {
					e.preventDefault();
				}
				file = e.target.files[0];
				if(file){
					name = file.name;
					type = file.type;
					size = file.size;
					reader = new FileReader();
					reader.onload = function(evt) {
						scope.callback({
							parent: scope.parent,
							attr: file,
							name: file.name,
							src: evt.target.result
						})
					};
					reader.readAsDataURL(file);
				}
				return false;
			});
			elem.bind('dragover', processDragOverOrEnter);
			elem.bind('dragenter', processDragOverOrEnter);
			return elem.bind('drop', function(event) {
				var file, name, reader, size, type;
				if (event != null) {
					event.preventDefault();
				}
				it.event = event;
				file = event.originalEvent.dataTransfer.files[0];
				name = file.name;
				type = file.type;
				size = file.size;
				reader = new FileReader();
				reader.onload = function(evt) {
					scope.callback({
						parent: scope.parent,
						attr: file,
						src: evt.target.result
					})
				};
				reader.readAsDataURL(file);
				return false;
			});
		}
	};
});
app.directive('fileManager', function() {
	console.log('fileManager')
	return {
		restrict: 'A',
		replace: true,
		transclude: true,
		template:	'<div>'+
				 		'<input type="file" class="hidden">'+
						'<div ng-transclude></div>'+
					'</div>',
		scope: {
			callback: 	'=fileManager',
			parent: 	'=parent'
		},
		link: function(scope, elem, attrs, ctrl) {
			console.log('fileManager')

			if(typeof(scope.callback)!='function'){
				console.error('fileManager: no callback defined.',scope.callback)
				return;
			}

			processDragOverOrEnter = function(event) {
				if (event != null) {
					event.preventDefault();
				}
				event.originalEvent.dataTransfer.effectAllowed = 'copy';
				return false;
			};


			elem.bind('click', function(e){
				//At some point, this may end up being a call to open a modal which links to the media list
				$(elem).children('input')[0].click()
			});

			elem.bind('change', function(e) {
				var file, name, reader, size, type;
				if (e != null) {
					e.preventDefault();
				}
				file = e.target.files[0];
				it.f = file;
				if(file){
					name = file.name;
					type = file.type;
					size = file.size;
					reader = new FileReader();
					reader.onload = function(evt) {
						scope.callback({
							parent: scope.parent,
							attr: file,
							name: file.name,
							src: evt.target.result
						})
					};
					// reader.readAsDataURL(file);
					reader.readAsText(file);
				}
				return false;
			});
			elem.bind('dragover', processDragOverOrEnter);
			elem.bind('dragenter', processDragOverOrEnter);
			return elem.bind('drop', function(event) {
				var file, name, reader, size, type;
				if (event != null) {
					event.preventDefault();
				}
				it.event = event;
				file = event.originalEvent.dataTransfer.files[0];
				name = file.name;
				type = file.type;
				size = file.size;
				reader = new FileReader();
				reader.onload = function(evt) {
					scope.callback({
						parent: scope.parent,
						attr: file,
						src: evt.target.result
					})
				};
				reader.readAsDataURL(file);
				return false;
			});
		}
	};
});
app.directive('ngEnter', function() {
	return function(scope, element, attrs) {
		element.bind("keydown keypress", function(event) {
			if (event.which === 13) {
				scope.$apply(function() {
					scope.$eval(attrs.ngEnter);
				});

				event.preventDefault();
			}
		});
	};
});
app.directive("contenteditable", function() {
	return {
		restrict: "A",
		require: "ngModel",
		link: function(scope, element, attrs, ngModel) {
			it.a = attrs;
			var read;
			if(!ngModel)
				return;
			
			ngModel.$render = function() {
				return element.text(ngModel.$viewValue);
			};
			element.bind('blur', function() {
				if (ngModel.$viewValue !== $.trim(element.text())) {
					return scope.$apply(read);
				}
			});
			return read = function() {
				var newVal = $.trim(element.text())
				if(!newVal && attrs.placeholder){
					newVal = attrs.placeholder;
					element.text(newVal);
				}
				return ngModel.$setViewValue(newVal);
			};
		}
	};
});

app.directive('tableMath', ['$interval', function($interval) {
	return {
		restrict: 'A',
		scope: true,
		link: function(scope, elm, attrs, ctrl) {
			var intervalPromise = $interval(function(){
				var col 	= Number(attrs.tableMath)
				var rows 	= $(elm).closest("table tbody").find('tr').length - 1;
				if(!scope.math || rows != scope.math.rows){
					if(rows){
						var sum 	= 0;
						$(elm).closest("table tbody")
							.find("tr:not(:last) td:nth-child(" + (col) + ")").each(function(e, a){
								sum += Number(a.innerText.replace(/[^0-9.]/g, ""));
							})
						var average = sum/rows;
						scope.math = {
							sum: 		Math.round(sum*100)/100,
							average: 	Math.round(average*100)/100,
							rows: 		rows
						}
					}else{
						scope.math = {
							sum: 		0,
							average: 	0,
							rows: 		0
						}
					}
				}
			}, 1000)
			scope.$on('$destroy', function () { $interval.cancel(intervalPromise); });
		},
	};
}]);
app.directive('report', function($compile, $sce) {
	return {
		restrict: 'A',
		replace: true,
		link: function(scope, ele, attrs) {
			scope.$watch(attrs.report, function(html) {
				html = html.replace('script', '')
				html = html.replace('onclick', '')
				ele.html(html);
				$compile(ele.contents())(scope);
			});
		}
	};
});

app.filter('capitalize', function() {
	return function(input, scope) {
		if (input != null)
			input = input.toLowerCase();
		return input.substring(0, 1).toUpperCase() + input.substring(1);
	}
});

app.filter('map', function(){
	return function(input, key){
		return input.map(function(item){
			return item[key]
		})
	}
})
app.directive('compile', function($compile) {
	return {
		restrict: 'A',
		link: function(scope, element, attr) {
			scope.$watch(function() {return element.attr('compile'); }, function(newValue){
				element.html($compile(attr.compile)(scope));
				it.e = element;
			});
		}
	}
})
app.directive('grid', function($compile, $timeout) {
	return {
		restrict: 'A',
		scope: {
			grid: 	'=',
		},
		link: function(scope, element, attr) {
			$(element).css({
				display: 'block',
				height: '500px'
			})
			
			function keep(api){
				api.onColumnsReordered.subscribe(function(){
					scope.grid.columns = api.getColumns();
					scope.$apply();
				})
				api.onCellChange.subscribe(function(evt, data){
					data.item._dirty = true;
					scope.grid.data = api.getData();
					scope.grid.changed = scope.grid.data.filter(function(item){
						return item._dirty
					}, true);
					scope.$apply();
					//Callback with row??
					it.change = data;
				})
			}
			
			if(scope.grid && scope.grid.columns && !scope.grid.api){
				scope.grid.api = new Slick.Grid($(element), scope.grid.data, scope.grid.columns, scope.grid.options);
				keep(scope.grid.api)
			}else{
				scope.$watch('grid.data', function(){
					if(scope.grid && scope.grid.columns){
						if(!scope.grid.api){
							scope.grid.api = new Slick.Grid($(element), scope.grid.data, scope.grid.columns, scope.grid.options);
							keep(scope.grid.api)
						}else{
							scope.grid.api.setColumns(scope.grid.columns)
							scope.grid.api.setData(scope.grid.data)
							scope.grid.api.render();
						}
					}
				})
			}
			// function reformat(){
			// 	var cells = $(element).find('tbody tr:first').children()
			// 	var colWidth = cells.map(function() {
			// 		return $(this).width();
			// 	}).get();
				
			// 	$(element).find('thead tr').children().each(function(i, v) {
			// 		$(v).width(colWidth[i]);
			// 	});
			// }
			// scope.$watch(function() {
			// 	console.log('data change')
			// 	reformat();
			// });
		}
	}
})
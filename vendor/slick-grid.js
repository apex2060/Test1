if(!function(e){e.fn.drag=function(t,o,l){var n="string"==typeof t?t:"",i=e.isFunction(t)?t:e.isFunction(o)?o:null;return 0!==n.indexOf("drag")&&(n="drag"+n),l=(t==i?o:l)||{},i?this.bind(n,l,i):this.trigger(n)};var t=e.event,o=t.special,l=o.drag={defaults:{which:1,distance:0,not:":input",handle:null,relative:!1,drop:!0,click:!1},datakey:"dragdata",noBubble:!0,add:function(t){var o=e.data(this,l.datakey),n=t.data||{};o.related+=1,e.each(l.defaults,function(e,t){void 0!==n[e]&&(o[e]=n[e])})},remove:function(){e.data(this,l.datakey).related-=1},setup:function(){if(!e.data(this,l.datakey)){var o=e.extend({related:0},l.defaults);e.data(this,l.datakey,o),t.add(this,"touchstart mousedown",l.init,o),this.attachEvent&&this.attachEvent("ondragstart",l.dontstart)}},teardown:function(){var o=e.data(this,l.datakey)||{};o.related||(e.removeData(this,l.datakey),t.remove(this,"touchstart mousedown",l.init),l.textselect(!0),this.detachEvent&&this.detachEvent("ondragstart",l.dontstart))},init:function(n){if(!l.touched){var i,r=n.data;if(!(0!=n.which&&r.which>0&&n.which!=r.which)&&!e(n.target).is(r.not)&&(!r.handle||e(n.target).closest(r.handle,n.currentTarget).length)&&(l.touched="touchstart"==n.type?this:null,r.propagates=1,r.mousedown=this,r.interactions=[l.interaction(this,r)],r.target=n.target,r.pageX=n.pageX,r.pageY=n.pageY,r.dragging=null,i=l.hijack(n,"draginit",r),r.propagates))return i=l.flatten(i),i&&i.length&&(r.interactions=[],e.each(i,function(){r.interactions.push(l.interaction(this,r))})),r.propagates=r.interactions.length,r.drop!==!1&&o.drop&&o.drop.handler(n,r),l.textselect(!1),l.touched?t.add(l.touched,"touchmove touchend",l.handler,r):t.add(document,"mousemove mouseup",l.handler,r),!l.touched||r.live?!1:void 0}},interaction:function(t,o){var n=e(t)[o.relative?"position":"offset"]()||{top:0,left:0};return{drag:t,callback:new l.callback,droppable:[],offset:n}},handler:function(n){var i=n.data;switch(n.type){case!i.dragging&&"touchmove":n.preventDefault();case!i.dragging&&"mousemove":if(Math.pow(n.pageX-i.pageX,2)+Math.pow(n.pageY-i.pageY,2)<Math.pow(i.distance,2))break;n.target=i.target,l.hijack(n,"dragstart",i),i.propagates&&(i.dragging=!0);case"touchmove":n.preventDefault();case"mousemove":if(i.dragging){if(l.hijack(n,"drag",i),i.propagates){i.drop!==!1&&o.drop&&o.drop.handler(n,i);break}n.type="mouseup"}case"touchend":case"mouseup":default:l.touched?t.remove(l.touched,"touchmove touchend",l.handler):t.remove(document,"mousemove mouseup",l.handler),i.dragging&&(i.drop!==!1&&o.drop&&o.drop.handler(n,i),l.hijack(n,"dragend",i)),l.textselect(!0),i.click===!1&&i.dragging&&e.data(i.mousedown,"suppress.click",(new Date).getTime()+5),i.dragging=l.touched=!1}},hijack:function(o,n,i,r,a){if(i){var s,c,d,u={event:o.originalEvent,type:o.type},h=n.indexOf("drop")?"drag":"drop",g=r||0,p=isNaN(r)?i.interactions.length:r;o.type=n,o.originalEvent=null,i.results=[];do if(c=i.interactions[g]){if("dragend"!==n&&c.cancelled)continue;d=l.properties(o,i,c),c.results=[],e(a||c[h]||i.droppable).each(function(r,a){return d.target=a,o.isPropagationStopped=function(){return!1},s=a?t.dispatch.call(a,o,d):null,s===!1?("drag"==h&&(c.cancelled=!0,i.propagates-=1),"drop"==n&&(c[h][r]=null)):"dropinit"==n&&c.droppable.push(l.element(s)||a),"dragstart"==n&&(c.proxy=e(l.element(s)||c.drag)[0]),c.results.push(s),delete o.result,"dropinit"!==n?s:void 0}),i.results[g]=l.flatten(c.results),"dropinit"==n&&(c.droppable=l.flatten(c.droppable)),"dragstart"!=n||c.cancelled||d.update()}while(++g<p);return o.type=u.type,o.originalEvent=u.event,l.flatten(i.results)}},properties:function(e,t,o){var n=o.callback;return n.drag=o.drag,n.proxy=o.proxy||o.drag,n.startX=t.pageX,n.startY=t.pageY,n.deltaX=e.pageX-t.pageX,n.deltaY=e.pageY-t.pageY,n.originalX=o.offset.left,n.originalY=o.offset.top,n.offsetX=n.originalX+n.deltaX,n.offsetY=n.originalY+n.deltaY,n.drop=l.flatten((o.drop||[]).slice()),n.available=l.flatten((o.droppable||[]).slice()),n},element:function(e){return e&&(e.jquery||1==e.nodeType)?e:void 0},flatten:function(t){return e.map(t,function(t){return t&&t.jquery?e.makeArray(t):t&&t.length?l.flatten(t):t})},textselect:function(t){e(document)[t?"unbind":"bind"]("selectstart",l.dontstart).css("MozUserSelect",t?"":"none"),document.unselectable=t?"off":"on"},dontstart:function(){return!1},callback:function(){}};l.callback.prototype={update:function(){o.drop&&this.available.length&&e.each(this.available,function(e){o.drop.locate(this,e)})}};var n=t.dispatch;t.dispatch=function(t){return e.data(this,"suppress."+t.type)-(new Date).getTime()>0?void e.removeData(this,"suppress."+t.type):n.apply(this,arguments)};var i=t.fixHooks.touchstart=t.fixHooks.touchmove=t.fixHooks.touchend=t.fixHooks.touchcancel={props:"clientX clientY pageX pageY screenX screenY".split(" "),filter:function(t,o){if(o){var l=o.touches&&o.touches[0]||o.changedTouches&&o.changedTouches[0]||null;l&&e.each(i.props,function(e,o){t[o]=l[o]})}return t}};o.draginit=o.dragstart=o.dragend=l}(jQuery),function(e){function t(){var e=!1,t=!1;this.stopPropagation=function(){e=!0},this.isPropagationStopped=function(){return e},this.stopImmediatePropagation=function(){t=!0},this.isImmediatePropagationStopped=function(){return t}}function o(){var e=[];this.subscribe=function(t){e.push(t)},this.unsubscribe=function(t){for(var o=e.length-1;o>=0;o--)e[o]===t&&e.splice(o,1)},this.notify=function(o,l,n){l=l||new t,n=n||this;for(var i,r=0;r<e.length&&!l.isPropagationStopped()&&!l.isImmediatePropagationStopped();r++)i=e[r].call(n,l,o);return i}}function l(){var e=[];this.subscribe=function(t,o){return e.push({event:t,handler:o}),t.subscribe(o),this},this.unsubscribe=function(t,o){for(var l=e.length;l--;)if(e[l].event===t&&e[l].handler===o)return e.splice(l,1),void t.unsubscribe(o);return this},this.unsubscribeAll=function(){for(var t=e.length;t--;)e[t].event.unsubscribe(e[t].handler);return e=[],this}}function n(e,t,o,l){void 0===o&&void 0===l&&(o=e,l=t),this.fromRow=Math.min(e,o),this.fromCell=Math.min(t,l),this.toRow=Math.max(e,o),this.toCell=Math.max(t,l),this.isSingleRow=function(){return this.fromRow==this.toRow},this.isSingleCell=function(){return this.fromRow==this.toRow&&this.fromCell==this.toCell},this.contains=function(e,t){return e>=this.fromRow&&e<=this.toRow&&t>=this.fromCell&&t<=this.toCell},this.toString=function(){return this.isSingleCell()?"("+this.fromRow+":"+this.fromCell+")":"("+this.fromRow+":"+this.fromCell+" - "+this.toRow+":"+this.toCell+")"}}function i(){this.__nonDataRow=!0}function r(){this.__group=!0,this.level=0,this.count=0,this.value=null,this.title=null,this.collapsed=!1,this.totals=null,this.rows=[],this.groups=null,this.groupingKey=null}function a(){this.__groupTotals=!0,this.group=null,this.initialized=!1}function s(){var e=null;this.isActive=function(t){return t?e===t:null!==e},this.activate=function(t){if(t!==e){if(null!==e)throw"SlickGrid.EditorLock.activate: an editController is still active, can't activate another editController";if(!t.commitCurrentEdit)throw"SlickGrid.EditorLock.activate: editController must implement .commitCurrentEdit()";if(!t.cancelCurrentEdit)throw"SlickGrid.EditorLock.activate: editController must implement .cancelCurrentEdit()";e=t}},this.deactivate=function(t){if(e!==t)throw"SlickGrid.EditorLock.deactivate: specified editController is not the currently active one";e=null},this.commitCurrentEdit=function(){return e?e.commitCurrentEdit():!0},this.cancelCurrentEdit=function(){return e?e.cancelCurrentEdit():!0}}e.extend(!0,window,{Slick:{Event:o,EventData:t,EventHandler:l,Range:n,NonDataRow:i,Group:r,GroupTotals:a,EditorLock:s,GlobalEditorLock:new s}}),r.prototype=new i,r.prototype.equals=function(e){return this.value===e.value&&this.count===e.count&&this.collapsed===e.collapsed&&this.title===e.title},a.prototype=new i}(jQuery),"undefined"==typeof jQuery)throw"SlickGrid requires jquery module to be loaded";if(!jQuery.fn.drag)throw"SlickGrid requires jquery.event.drag module to be loaded";if("undefined"==typeof Slick)throw"slick.core.js not loaded";!function($){function SlickGrid(container,data,columns,options){function init(){if($container=$(container),$container.length<1)throw new Error("SlickGrid requires a valid container, "+container+" does not exist in the DOM.");maxSupportedCssHeight=maxSupportedCssHeight||getMaxSupportedCssHeight(),scrollbarDimensions=scrollbarDimensions||measureScrollbar(),options=$.extend({},defaults,options),validateAndEnforceOptions(),columnDefaults.width=options.defaultColumnWidth,columnsById={};for(var e=0;e<columns.length;e++){var t=columns[e]=$.extend({},columnDefaults,columns[e]);columnsById[t.id]=e,t.minWidth&&t.width<t.minWidth&&(t.width=t.minWidth),t.maxWidth&&t.width>t.maxWidth&&(t.width=t.maxWidth)}if(options.enableColumnReorder&&!$.fn.sortable)throw new Error("SlickGrid's 'enableColumnReorder = true' option requires jquery-ui.sortable module to be loaded");editController={commitCurrentEdit:commitCurrentEdit,cancelCurrentEdit:cancelCurrentEdit},$container.empty().css("overflow","hidden").css("outline",0).addClass(uid).addClass("ui-widget"),/relative|absolute|fixed/.test($container.css("position"))||$container.css("position","relative"),$focusSink=$("<div tabIndex='0' hideFocus style='position:fixed;width:0;height:0;top:0;left:0;outline:0;'></div>").appendTo($container),$headerScroller=$("<div class='slick-header ui-state-default' style='overflow:hidden;position:relative;' />").appendTo($container),$headers=$("<div class='slick-header-columns' style='left:-1000px' />").appendTo($headerScroller),$headers.width(getHeadersWidth()),$headerRowScroller=$("<div class='slick-headerrow ui-state-default' style='overflow:hidden;position:relative;' />").appendTo($container),$headerRow=$("<div class='slick-headerrow-columns' />").appendTo($headerRowScroller),$headerRowSpacer=$("<div style='display:block;height:1px;position:absolute;top:0;left:0;'></div>").css("width",getCanvasWidth()+scrollbarDimensions.width+"px").appendTo($headerRowScroller),$topPanelScroller=$("<div class='slick-top-panel-scroller ui-state-default' style='overflow:hidden;position:relative;' />").appendTo($container),$topPanel=$("<div class='slick-top-panel' style='width:10000px' />").appendTo($topPanelScroller),options.showTopPanel||$topPanelScroller.hide(),options.showHeaderRow||$headerRowScroller.hide(),$viewport=$("<div class='slick-viewport' style='width:100%;overflow:auto;outline:0;position:relative;;'>").appendTo($container),$viewport.css("overflow-y",options.autoHeight?"hidden":"auto"),$canvas=$("<div class='grid-canvas' />").appendTo($viewport),$focusSink2=$focusSink.clone().appendTo($container),options.explicitInitialization||finishInitialization()}function finishInitialization(){initialized||(initialized=!0,viewportW=parseFloat($.css($container[0],"width",!0)),measureCellPaddingAndBorder(),disableSelection($headers),options.enableTextSelectionOnCells||$viewport.bind("selectstart.ui",function(e){return $(e.target).is("input,textarea")}),updateColumnCaches(),createColumnHeaders(),setupColumnSort(),createCssRules(),resizeCanvas(),bindAncestorScrollEvents(),$container.bind("resize.slickgrid",resizeCanvas),$viewport.bind("scroll",handleScroll),$headerScroller.bind("contextmenu",handleHeaderContextMenu).bind("click",handleHeaderClick).delegate(".slick-header-column","mouseenter",handleHeaderMouseEnter).delegate(".slick-header-column","mouseleave",handleHeaderMouseLeave),$headerRowScroller.bind("scroll",handleHeaderRowScroll),$focusSink.add($focusSink2).bind("keydown",handleKeyDown),$canvas.bind("keydown",handleKeyDown).bind("click",handleClick).bind("dblclick",handleDblClick).bind("contextmenu",handleContextMenu).bind("draginit",handleDragInit).bind("dragstart",{distance:3},handleDragStart).bind("drag",handleDrag).bind("dragend",handleDragEnd).delegate(".slick-cell","mouseenter",handleMouseEnter).delegate(".slick-cell","mouseleave",handleMouseLeave),navigator.userAgent.toLowerCase().match(/webkit/)&&navigator.userAgent.toLowerCase().match(/macintosh/)&&$canvas.bind("mousewheel",handleMouseWheel))}function registerPlugin(e){plugins.unshift(e),e.init(self)}function unregisterPlugin(e){for(var t=plugins.length;t>=0;t--)if(plugins[t]===e){plugins[t].destroy&&plugins[t].destroy(),plugins.splice(t,1);break}}function setSelectionModel(e){selectionModel&&(selectionModel.onSelectedRangesChanged.unsubscribe(handleSelectedRangesChanged),selectionModel.destroy&&selectionModel.destroy()),selectionModel=e,selectionModel&&(selectionModel.init(self),selectionModel.onSelectedRangesChanged.subscribe(handleSelectedRangesChanged))}function getSelectionModel(){return selectionModel}function getCanvasNode(){return $canvas[0]}function measureScrollbar(){var e=$("<div style='position:absolute; top:-10000px; left:-10000px; width:100px; height:100px; overflow:scroll;'></div>").appendTo("body"),t={width:e.width()-e[0].clientWidth,height:e.height()-e[0].clientHeight};return e.remove(),t}function getHeadersWidth(){for(var e=0,t=0,o=columns.length;o>t;t++){var l=columns[t].width;e+=l}return e+=scrollbarDimensions.width,Math.max(e,viewportW)+1e3}function getCanvasWidth(){for(var e=viewportHasVScroll?viewportW-scrollbarDimensions.width:viewportW,t=0,o=columns.length;o--;)t+=columns[o].width;return options.fullWidthRows?Math.max(t,e):t}function updateCanvasWidth(e){var t=canvasWidth;canvasWidth=getCanvasWidth(),canvasWidth!=t&&($canvas.width(canvasWidth),$headerRow.width(canvasWidth),$headers.width(getHeadersWidth()),viewportHasHScroll=canvasWidth>viewportW-scrollbarDimensions.width),$headerRowSpacer.width(canvasWidth+(viewportHasVScroll?scrollbarDimensions.width:0)),(canvasWidth!=t||e)&&applyColumnWidths()}function disableSelection(e){e&&e.jquery&&e.attr("unselectable","on").css("MozUserSelect","none").bind("selectstart.ui",function(){return!1})}function getMaxSupportedCssHeight(){for(var e=1e6,t=navigator.userAgent.toLowerCase().match(/firefox/)?6e6:1e9,o=$("<div style='display:none' />").appendTo(document.body);;){var l=2*e;if(o.css("height",l),l>t||o.height()!==l)break;e=l}return o.remove(),e}function bindAncestorScrollEvents(){for(var e=$canvas[0];(e=e.parentNode)!=document.body&&null!=e;)if(e==$viewport[0]||e.scrollWidth!=e.clientWidth||e.scrollHeight!=e.clientHeight){var t=$(e);$boundAncestors=$boundAncestors?$boundAncestors.add(t):t,t.bind("scroll."+uid,handleActiveCellPositionChange)}}function unbindAncestorScrollEvents(){$boundAncestors&&($boundAncestors.unbind("scroll."+uid),$boundAncestors=null)}function updateColumnHeader(e,t,o){if(initialized){var l=getColumnIndex(e);if(null!=l){var n=columns[l],i=$headers.children().eq(l);i&&(void 0!==t&&(columns[l].name=t),void 0!==o&&(columns[l].toolTip=o),trigger(self.onBeforeHeaderCellDestroy,{node:i[0],column:n}),i.attr("title",o||"").children().eq(0).html(t),trigger(self.onHeaderCellRendered,{node:i[0],column:n}))}}}function getHeaderRow(){return $headerRow[0]}function getHeaderRowColumn(e){var t=getColumnIndex(e),o=$headerRow.children().eq(t);return o&&o[0]}function createColumnHeaders(){function e(){$(this).addClass("ui-state-hover")}function t(){$(this).removeClass("ui-state-hover")}$headers.find(".slick-header-column").each(function(){var e=$(this).data("column");e&&trigger(self.onBeforeHeaderCellDestroy,{node:this,column:e})}),$headers.empty(),$headers.width(getHeadersWidth()),$headerRow.find(".slick-headerrow-column").each(function(){var e=$(this).data("column");e&&trigger(self.onBeforeHeaderRowCellDestroy,{node:this,column:e})}),$headerRow.empty();for(var o=0;o<columns.length;o++){var l=columns[o],n=$("<div class='ui-state-default slick-header-column' />").html("<span class='slick-column-name'>"+l.name+"</span>").width(l.width-headerColumnWidthDiff).attr("id",""+uid+l.id).attr("title",l.toolTip||"").data("column",l).addClass(l.headerCssClass||"").appendTo($headers);if((options.enableColumnReorder||l.sortable)&&n.on("mouseenter",e).on("mouseleave",t),l.sortable&&(n.addClass("slick-header-sortable"),n.append("<span class='slick-sort-indicator' />")),trigger(self.onHeaderCellRendered,{node:n[0],column:l}),options.showHeaderRow){var i=$("<div class='ui-state-default slick-headerrow-column l"+o+" r"+o+"'></div>").data("column",l).appendTo($headerRow);trigger(self.onHeaderRowCellRendered,{node:i[0],column:l})}}setSortColumns(sortColumns),setupColumnResize(),options.enableColumnReorder&&setupColumnReorder()}function setupColumnSort(){$headers.click(function(e){if(e.metaKey=e.metaKey||e.ctrlKey,!$(e.target).hasClass("slick-resizable-handle")){var t=$(e.target).closest(".slick-header-column");if(t.length){var o=t.data("column");if(o.sortable){if(!getEditorLock().commitCurrentEdit())return;for(var l=null,n=0;n<sortColumns.length;n++)if(sortColumns[n].columnId==o.id){l=sortColumns[n],l.sortAsc=!l.sortAsc;break}e.metaKey&&options.multiColumnSort?l&&sortColumns.splice(n,1):((e.shiftKey||e.metaKey)&&options.multiColumnSort||(sortColumns=[]),l?0==sortColumns.length&&sortColumns.push(l):(l={columnId:o.id,sortAsc:o.defaultSortAsc},sortColumns.push(l))),setSortColumns(sortColumns),options.multiColumnSort?trigger(self.onSort,{multiColumnSort:!0,sortCols:$.map(sortColumns,function(e){return{sortCol:columns[getColumnIndex(e.columnId)],sortAsc:e.sortAsc}})},e):trigger(self.onSort,{multiColumnSort:!1,sortCol:o,sortAsc:l.sortAsc},e)}}}})}function setupColumnReorder(){$headers.filter(":ui-sortable").sortable("destroy"),$headers.sortable({containment:"parent",distance:3,axis:"x",cursor:"default",tolerance:"intersection",helper:"clone",placeholder:"slick-sortable-placeholder ui-state-default slick-header-column",start:function(e,t){t.placeholder.width(t.helper.outerWidth()-headerColumnWidthDiff),$(t.helper).addClass("slick-header-column-active")},beforeStop:function(e,t){$(t.helper).removeClass("slick-header-column-active")},stop:function(e){if(!getEditorLock().commitCurrentEdit())return void $(this).sortable("cancel");for(var t=$headers.sortable("toArray"),o=[],l=0;l<t.length;l++)o.push(columns[getColumnIndex(t[l].replace(uid,""))]);setColumns(o),trigger(self.onColumnsReordered,{}),e.stopPropagation(),setupColumnResize()}})}function setupColumnResize(){var e,t,o,l,n,i,r,a,s;n=$headers.children(),n.find(".slick-resizable-handle").remove(),n.each(function(e,t){columns[e].resizable&&(void 0===a&&(a=e),s=e)}),void 0!==a&&n.each(function(c,d){a>c||options.forceFitColumns&&c>=s||(e=$(d),$("<div class='slick-resizable-handle' />").appendTo(d).bind("dragstart",function(e,a){if(!getEditorLock().commitCurrentEdit())return!1;l=e.pageX,$(this).parent().addClass("slick-header-column-active");var s=null,d=null;if(n.each(function(e,t){columns[e].previousWidth=$(t).outerWidth()}),options.forceFitColumns)for(s=0,d=0,t=c+1;t<n.length;t++)o=columns[t],o.resizable&&(null!==d&&(o.maxWidth?d+=o.maxWidth-o.previousWidth:d=null),s+=o.previousWidth-Math.max(o.minWidth||0,absoluteColumnMinWidth));var u=0,h=0;for(t=0;c>=t;t++)o=columns[t],o.resizable&&(null!==h&&(o.maxWidth?h+=o.maxWidth-o.previousWidth:h=null),u+=o.previousWidth-Math.max(o.minWidth||0,absoluteColumnMinWidth));null===s&&(s=1e5),null===u&&(u=1e5),null===d&&(d=1e5),null===h&&(h=1e5),r=l+Math.min(s,h),i=l-Math.min(u,d)}).bind("drag",function(e,a){var s,d,u=Math.min(r,Math.max(i,e.pageX))-l;if(0>u){for(d=u,t=c;t>=0;t--)o=columns[t],o.resizable&&(s=Math.max(o.minWidth||0,absoluteColumnMinWidth),d&&o.previousWidth+d<s?(d+=o.previousWidth-s,o.width=s):(o.width=o.previousWidth+d,d=0));if(options.forceFitColumns)for(d=-u,t=c+1;t<n.length;t++)o=columns[t],o.resizable&&(d&&o.maxWidth&&o.maxWidth-o.previousWidth<d?(d-=o.maxWidth-o.previousWidth,o.width=o.maxWidth):(o.width=o.previousWidth+d,d=0))}else{for(d=u,t=c;t>=0;t--)o=columns[t],o.resizable&&(d&&o.maxWidth&&o.maxWidth-o.previousWidth<d?(d-=o.maxWidth-o.previousWidth,o.width=o.maxWidth):(o.width=o.previousWidth+d,d=0));if(options.forceFitColumns)for(d=-u,t=c+1;t<n.length;t++)o=columns[t],o.resizable&&(s=Math.max(o.minWidth||0,absoluteColumnMinWidth),d&&o.previousWidth+d<s?(d+=o.previousWidth-s,o.width=s):(o.width=o.previousWidth+d,d=0))}applyColumnHeaderWidths(),options.syncColumnCellResize&&applyColumnWidths()}).bind("dragend",function(e,l){var i;for($(this).parent().removeClass("slick-header-column-active"),t=0;t<n.length;t++)o=columns[t],i=$(n[t]).outerWidth(),o.previousWidth!==i&&o.rerenderOnResize&&invalidateAllRows();updateCanvasWidth(!0),render(),trigger(self.onColumnsResized,{})}))})}function getVBoxDelta(e){var t=["borderTopWidth","borderBottomWidth","paddingTop","paddingBottom"],o=0;return $.each(t,function(t,l){o+=parseFloat(e.css(l))||0}),o}function measureCellPaddingAndBorder(){var e,t=["borderLeftWidth","borderRightWidth","paddingLeft","paddingRight"],o=["borderTopWidth","borderBottomWidth","paddingTop","paddingBottom"];e=$("<div class='ui-state-default slick-header-column' style='visibility:hidden'>-</div>").appendTo($headers),headerColumnWidthDiff=headerColumnHeightDiff=0,"border-box"!=e.css("box-sizing")&&"border-box"!=e.css("-moz-box-sizing")&&"border-box"!=e.css("-webkit-box-sizing")&&($.each(t,function(t,o){headerColumnWidthDiff+=parseFloat(e.css(o))||0}),$.each(o,function(t,o){headerColumnHeightDiff+=parseFloat(e.css(o))||0})),e.remove();var l=$("<div class='slick-row' />").appendTo($canvas);e=$("<div class='slick-cell' id='' style='visibility:hidden'>-</div>").appendTo(l),cellWidthDiff=cellHeightDiff=0,"border-box"!=e.css("box-sizing")&&"border-box"!=e.css("-moz-box-sizing")&&"border-box"!=e.css("-webkit-box-sizing")&&($.each(t,function(t,o){cellWidthDiff+=parseFloat(e.css(o))||0}),$.each(o,function(t,o){cellHeightDiff+=parseFloat(e.css(o))||0})),l.remove(),absoluteColumnMinWidth=Math.max(headerColumnWidthDiff,cellWidthDiff)}function createCssRules(){$style=$("<style type='text/css' rel='stylesheet' />").appendTo($("head"));for(var e=options.rowHeight-cellHeightDiff,t=["."+uid+" .slick-header-column { left: 1000px; }","."+uid+" .slick-top-panel { height:"+options.topPanelHeight+"px; }","."+uid+" .slick-headerrow-columns { height:"+options.headerRowHeight+"px; }","."+uid+" .slick-cell { height:"+e+"px; }","."+uid+" .slick-row { height:"+options.rowHeight+"px; }"],o=0;o<columns.length;o++)t.push("."+uid+" .l"+o+" { }"),t.push("."+uid+" .r"+o+" { }");$style[0].styleSheet?$style[0].styleSheet.cssText=t.join(" "):$style[0].appendChild(document.createTextNode(t.join(" ")))}function getColumnCssRules(e){if(!stylesheet){for(var t=document.styleSheets,o=0;o<t.length;o++)if((t[o].ownerNode||t[o].owningElement)==$style[0]){stylesheet=t[o];break}if(!stylesheet)throw new Error("Cannot find stylesheet.");columnCssRulesL=[],columnCssRulesR=[];for(var l,n,i=stylesheet.cssRules||stylesheet.rules,o=0;o<i.length;o++){var r=i[o].selectorText;(l=/\.l\d+/.exec(r))?(n=parseInt(l[0].substr(2,l[0].length-2),10),columnCssRulesL[n]=i[o]):(l=/\.r\d+/.exec(r))&&(n=parseInt(l[0].substr(2,l[0].length-2),10),columnCssRulesR[n]=i[o])}}return{left:columnCssRulesL[e],right:columnCssRulesR[e]}}function removeCssRules(){$style.remove(),stylesheet=null}function destroy(){getEditorLock().cancelCurrentEdit(),trigger(self.onBeforeDestroy,{});for(var e=plugins.length;e--;)unregisterPlugin(plugins[e]);options.enableColumnReorder&&$headers.filter(":ui-sortable").sortable("destroy"),unbindAncestorScrollEvents(),$container.unbind(".slickgrid"),removeCssRules(),$canvas.unbind("draginit dragstart dragend drag"),$container.empty().removeClass(uid)}function trigger(e,t,o){return o=o||new Slick.EventData,t=t||{},t.grid=self,e.notify(t,o,self)}function getEditorLock(){return options.editorLock}function getEditController(){return editController}function getColumnIndex(e){return columnsById[e]}function autosizeColumns(){var e,t,o,l=[],n=0,i=0,r=viewportHasVScroll?viewportW-scrollbarDimensions.width:viewportW;for(e=0;e<columns.length;e++)t=columns[e],l.push(t.width),i+=t.width,t.resizable&&(n+=t.width-Math.max(t.minWidth,absoluteColumnMinWidth));for(o=i;i>r&&n;){var a=(i-r)/n;for(e=0;e<columns.length&&i>r;e++){t=columns[e];var s=l[e];if(!(!t.resizable||s<=t.minWidth||absoluteColumnMinWidth>=s)){var c=Math.max(t.minWidth,absoluteColumnMinWidth),d=Math.floor(a*(s-c))||1;d=Math.min(d,s-c),i-=d,n-=d,l[e]-=d}}if(i>=o)break;o=i}for(o=i;r>i;){var u=r/i;for(e=0;e<columns.length&&r>i;e++){t=columns[e];var h,g=l[e];h=!t.resizable||t.maxWidth<=g?0:Math.min(Math.floor(u*g)-g,t.maxWidth-g||1e6)||1,i+=h,l[e]+=h}if(o>=i)break;o=i}var p=!1;for(e=0;e<columns.length;e++)columns[e].rerenderOnResize&&columns[e].width!=l[e]&&(p=!0),columns[e].width=l[e];applyColumnHeaderWidths(),updateCanvasWidth(!0),p&&(invalidateAllRows(),render())}function applyColumnHeaderWidths(){if(initialized){for(var e,t=0,o=$headers.children(),l=o.length;l>t;t++)e=$(o[t]),e.width()!==columns[t].width-headerColumnWidthDiff&&e.width(columns[t].width-headerColumnWidthDiff);updateColumnCaches()}}function applyColumnWidths(){for(var e,t,o=0,l=0;l<columns.length;l++)e=columns[l].width,t=getColumnCssRules(l),t.left.style.left=o+"px",t.right.style.right=canvasWidth-o-e+"px",o+=columns[l].width}function setSortColumn(e,t){setSortColumns([{columnId:e,sortAsc:t}])}function setSortColumns(e){sortColumns=e;var t=$headers.children();t.removeClass("slick-header-column-sorted").find(".slick-sort-indicator").removeClass("slick-sort-indicator-asc slick-sort-indicator-desc"),$.each(sortColumns,function(e,o){null==o.sortAsc&&(o.sortAsc=!0);var l=getColumnIndex(o.columnId);null!=l&&t.eq(l).addClass("slick-header-column-sorted").find(".slick-sort-indicator").addClass(o.sortAsc?"slick-sort-indicator-asc":"slick-sort-indicator-desc")})}function getSortColumns(){return sortColumns}function handleSelectedRangesChanged(e,t){selectedRows=[];for(var o={},l=0;l<t.length;l++)for(var n=t[l].fromRow;n<=t[l].toRow;n++){o[n]||(selectedRows.push(n),o[n]={});for(var i=t[l].fromCell;i<=t[l].toCell;i++)canCellBeSelected(n,i)&&(o[n][columns[i].id]=options.selectedCellCssClass)}setCellCssStyles(options.selectedCellCssClass,o),trigger(self.onSelectedRowsChanged,{rows:getSelectedRows()},e)}function getColumns(){return columns}function updateColumnCaches(){columnPosLeft=[],columnPosRight=[];for(var e=0,t=0,o=columns.length;o>t;t++)columnPosLeft[t]=e,columnPosRight[t]=e+columns[t].width,e+=columns[t].width}function setColumns(e){columns=e,columnsById={};for(var t=0;t<columns.length;t++){var o=columns[t]=$.extend({},columnDefaults,columns[t]);columnsById[o.id]=t,o.minWidth&&o.width<o.minWidth&&(o.width=o.minWidth),o.maxWidth&&o.width>o.maxWidth&&(o.width=o.maxWidth)}updateColumnCaches(),initialized&&(invalidateAllRows(),createColumnHeaders(),removeCssRules(),createCssRules(),resizeCanvas(),applyColumnWidths(),handleScroll())}function getOptions(){return options}function setOptions(e){getEditorLock().commitCurrentEdit()&&(makeActiveCellNormal(),options.enableAddRow!==e.enableAddRow&&invalidateRow(getDataLength()),options=$.extend(options,e),validateAndEnforceOptions(),$viewport.css("overflow-y",options.autoHeight?"hidden":"auto"),render())}function validateAndEnforceOptions(){options.autoHeight&&(options.leaveSpaceForNewRows=!1)}function setData(e,t){data=e,invalidateAllRows(),updateRowCount(),t&&scrollTo(0)}function getData(){return data}function getDataLength(){return data.getLength?data.getLength():data.length}function getDataLengthIncludingAddNew(){return getDataLength()+(options.enableAddRow?1:0)}function getDataItem(e){return data.getItem?data.getItem(e):data[e]}function getTopPanel(){return $topPanel[0]}function setTopPanelVisibility(e){options.showTopPanel!=e&&(options.showTopPanel=e,e?$topPanelScroller.slideDown("fast",resizeCanvas):$topPanelScroller.slideUp("fast",resizeCanvas))}function setHeaderRowVisibility(e){options.showHeaderRow!=e&&(options.showHeaderRow=e,e?$headerRowScroller.slideDown("fast",resizeCanvas):$headerRowScroller.slideUp("fast",resizeCanvas))}function getContainerNode(){return $container.get(0)}function getRowTop(e){return options.rowHeight*e-offset}function getRowFromPosition(e){return Math.floor((e+offset)/options.rowHeight)}function scrollTo(e){e=Math.max(e,0),e=Math.min(e,th-viewportH+(viewportHasHScroll?scrollbarDimensions.height:0));var t=offset;page=Math.min(n-1,Math.floor(e/ph)),offset=Math.round(page*cj);var o=e-offset;if(offset!=t){var l=getVisibleRange(o);cleanupRows(l),updateRowPositions()}prevScrollTop!=o&&(vScrollDir=o+offset>prevScrollTop+t?1:-1,$viewport[0].scrollTop=lastRenderedScrollTop=scrollTop=prevScrollTop=o,trigger(self.onViewportChanged,{}))}function defaultFormatter(e,t,o,l,n){return null==o?"":(o+"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function getFormatter(e,t){var o=data.getItemMetadata&&data.getItemMetadata(e),l=o&&o.columns&&(o.columns[t.id]||o.columns[getColumnIndex(t.id)]);return l&&l.formatter||o&&o.formatter||t.formatter||options.formatterFactory&&options.formatterFactory.getFormatter(t)||options.defaultFormatter}function getEditor(e,t){var o=columns[t],l=data.getItemMetadata&&data.getItemMetadata(e),n=l&&l.columns;return n&&n[o.id]&&void 0!==n[o.id].editor?n[o.id].editor:n&&n[t]&&void 0!==n[t].editor?n[t].editor:o.editor||options.editorFactory&&options.editorFactory.getEditor(o)}function getDataItemValueForColumn(e,t){return options.dataItemColumnValueExtractor?options.dataItemColumnValueExtractor(e,t):e[t.field]}function appendRowHtml(e,t,o,l){var n=getDataItem(t),i=l>t&&!n,r="slick-row"+(i?" loading":"")+(t===activeRow?" active":"")+(t%2==1?" odd":" even");n||(r+=" "+options.addNewRowCssClass);var a=data.getItemMetadata&&data.getItemMetadata(t);a&&a.cssClasses&&(r+=" "+a.cssClasses),e.push("<div class='ui-widget-content "+r+"' style='top:"+getRowTop(t)+"px'>");for(var s,c,d=0,u=columns.length;u>d;d++){if(c=columns[d],s=1,a&&a.columns){var h=a.columns[c.id]||a.columns[d];s=h&&h.colspan||1,"*"===s&&(s=u-d)}if(columnPosRight[Math.min(u-1,d+s-1)]>o.leftPx){if(columnPosLeft[d]>o.rightPx)break;appendCellHtml(e,t,d,s,n)}s>1&&(d+=s-1)}e.push("</div>")}function appendCellHtml(e,t,o,l,n){var i=columns[o],r="slick-cell l"+o+" r"+Math.min(columns.length-1,o+l-1)+(i.cssClass?" "+i.cssClass:"");t===activeRow&&o===activeCell&&(r+=" active");for(var a in cellCssClasses)cellCssClasses[a][t]&&cellCssClasses[a][t][i.id]&&(r+=" "+cellCssClasses[a][t][i.id]);if(e.push("<div class='"+r+"'>"),n){var s=getDataItemValueForColumn(n,i);e.push(getFormatter(t,i)(t,o,s,i,n))}e.push("</div>"),rowsCache[t].cellRenderQueue.push(o),rowsCache[t].cellColSpans[o]=l}function cleanupRows(e){for(var t in rowsCache)(t=parseInt(t,10))!==activeRow&&(t<e.top||t>e.bottom)&&removeRowFromCache(t)}function invalidate(){updateRowCount(),invalidateAllRows(),render()}function invalidateAllRows(){currentEditor&&makeActiveCellNormal();for(var e in rowsCache)removeRowFromCache(e)}function removeRowFromCache(e){var t=rowsCache[e];t&&(rowNodeFromLastMouseWheelEvent==t.rowNode?(t.rowNode.style.display="none",zombieRowNodeFromLastMouseWheelEvent=rowNodeFromLastMouseWheelEvent):$canvas[0].removeChild(t.rowNode),delete rowsCache[e],delete postProcessedRows[e],renderedRows--,counter_rows_removed++)}function invalidateRows(e){var t,o;if(e&&e.length)for(vScrollDir=0,t=0,o=e.length;o>t;t++)currentEditor&&activeRow===e[t]&&makeActiveCellNormal(),rowsCache[e[t]]&&removeRowFromCache(e[t])}function invalidateRow(e){invalidateRows([e])}function updateCell(e,t){var o=getCellNode(e,t);if(o){var l=columns[t],n=getDataItem(e);currentEditor&&activeRow===e&&activeCell===t?currentEditor.loadValue(n):(o.innerHTML=n?getFormatter(e,l)(e,t,getDataItemValueForColumn(n,l),l,n):"",invalidatePostProcessingResults(e))}}function updateRow(e){var t=rowsCache[e];if(t){ensureCellNodesInRowsCache(e);var o=getDataItem(e);for(var l in t.cellNodesByColumnIdx)if(t.cellNodesByColumnIdx.hasOwnProperty(l)){l=0|l;var n=columns[l],i=t.cellNodesByColumnIdx[l];e===activeRow&&l===activeCell&&currentEditor?currentEditor.loadValue(o):o?i.innerHTML=getFormatter(e,n)(e,l,getDataItemValueForColumn(o,n),n,o):i.innerHTML=""}invalidatePostProcessingResults(e)}}function getViewportHeight(){
return parseFloat($.css($container[0],"height",!0))-parseFloat($.css($container[0],"paddingTop",!0))-parseFloat($.css($container[0],"paddingBottom",!0))-parseFloat($.css($headerScroller[0],"height"))-getVBoxDelta($headerScroller)-(options.showTopPanel?options.topPanelHeight+getVBoxDelta($topPanelScroller):0)-(options.showHeaderRow?options.headerRowHeight+getVBoxDelta($headerRowScroller):0)}function resizeCanvas(){initialized&&(viewportH=options.autoHeight?options.rowHeight*getDataLengthIncludingAddNew():getViewportHeight(),numVisibleRows=Math.ceil(viewportH/options.rowHeight),viewportW=parseFloat($.css($container[0],"width",!0)),options.autoHeight||$viewport.height(viewportH),options.forceFitColumns&&autosizeColumns(),updateRowCount(),handleScroll(),lastRenderedScrollLeft=-1,render())}function updateRowCount(){if(initialized){var e=getDataLengthIncludingAddNew(),t=e+(options.leaveSpaceForNewRows?numVisibleRows-1:0),o=viewportHasVScroll;viewportHasVScroll=!options.autoHeight&&t*options.rowHeight>viewportH,makeActiveCellNormal();var l=e-1;for(var i in rowsCache)i>=l&&removeRowFromCache(i);activeCellNode&&activeRow>l&&resetActiveCell();var r=h;th=Math.max(options.rowHeight*t,viewportH-scrollbarDimensions.height),maxSupportedCssHeight>th?(h=ph=th,n=1,cj=0):(h=maxSupportedCssHeight,ph=h/100,n=Math.floor(th/ph),cj=(th-h)/(n-1)),h!==r&&($canvas.css("height",h),scrollTop=$viewport[0].scrollTop);var a=th-viewportH>=scrollTop+offset;0==th||0==scrollTop?page=offset=0:scrollTo(a?scrollTop+offset:th-viewportH),h!=r&&options.autoHeight&&resizeCanvas(),options.forceFitColumns&&o!=viewportHasVScroll&&autosizeColumns(),updateCanvasWidth(!1)}}function getVisibleRange(e,t){return null==e&&(e=scrollTop),null==t&&(t=scrollLeft),{top:getRowFromPosition(e),bottom:getRowFromPosition(e+viewportH)+1,leftPx:t,rightPx:t+viewportW}}function getRenderedRange(e,t){var o=getVisibleRange(e,t),l=Math.round(viewportH/options.rowHeight),n=3;return-1==vScrollDir?(o.top-=l,o.bottom+=n):1==vScrollDir?(o.top-=n,o.bottom+=l):(o.top-=n,o.bottom+=n),o.top=Math.max(0,o.top),o.bottom=Math.min(getDataLengthIncludingAddNew()-1,o.bottom),o.leftPx-=viewportW,o.rightPx+=viewportW,o.leftPx=Math.max(0,o.leftPx),o.rightPx=Math.min(canvasWidth,o.rightPx),o}function ensureCellNodesInRowsCache(e){var t=rowsCache[e];if(t&&t.cellRenderQueue.length)for(var o=t.rowNode.lastChild;t.cellRenderQueue.length;){var l=t.cellRenderQueue.pop();t.cellNodesByColumnIdx[l]=o,o=o.previousSibling}}function cleanUpCells(e,t){var o=0,l=rowsCache[t],n=[];for(var i in l.cellNodesByColumnIdx)if(l.cellNodesByColumnIdx.hasOwnProperty(i)){i=0|i;var r=l.cellColSpans[i];(columnPosLeft[i]>e.rightPx||columnPosRight[Math.min(columns.length-1,i+r-1)]<e.leftPx)&&(t!=activeRow||i!=activeCell)&&n.push(i)}for(var a;null!=(a=n.pop());)l.rowNode.removeChild(l.cellNodesByColumnIdx[a]),delete l.cellColSpans[a],delete l.cellNodesByColumnIdx[a],postProcessedRows[t]&&delete postProcessedRows[t][a],o++}function cleanUpAndRenderCells(e){for(var t,o,l,n=[],i=[],r=0,a=e.top,s=e.bottom;s>=a;a++)if(t=rowsCache[a]){ensureCellNodesInRowsCache(a),cleanUpCells(e,a),o=0;var c=data.getItemMetadata&&data.getItemMetadata(a);c=c&&c.columns;for(var d=getDataItem(a),u=0,h=columns.length;h>u&&!(columnPosLeft[u]>e.rightPx);u++)if(null==(l=t.cellColSpans[u])){if(l=1,c){var g=c[columns[u].id]||c[u];l=g&&g.colspan||1,"*"===l&&(l=h-u)}columnPosRight[Math.min(h-1,u+l-1)]>e.leftPx&&(appendCellHtml(n,a,u,l,d),o++),u+=l>1?l-1:0}else u+=l>1?l-1:0;o&&(r+=o,i.push(a))}if(n.length){var p=document.createElement("div");p.innerHTML=n.join("");for(var v,f;null!=(v=i.pop());){t=rowsCache[v];for(var m;null!=(m=t.cellRenderQueue.pop());)f=p.lastChild,t.rowNode.appendChild(f),t.cellNodesByColumnIdx[m]=f}}}function renderRows(e){for(var t=$canvas[0],o=[],l=[],n=!1,i=getDataLength(),r=e.top,a=e.bottom;a>=r;r++)rowsCache[r]||(renderedRows++,l.push(r),rowsCache[r]={rowNode:null,cellColSpans:[],cellNodesByColumnIdx:[],cellRenderQueue:[]},appendRowHtml(o,r,e,i),activeCellNode&&activeRow===r&&(n=!0),counter_rows_rendered++);if(l.length){var s=document.createElement("div");s.innerHTML=o.join("");for(var r=0,a=l.length;a>r;r++)rowsCache[l[r]].rowNode=t.appendChild(s.firstChild);n&&(activeCellNode=getCellNode(activeRow,activeCell))}}function startPostProcessing(){options.enableAsyncPostRender&&(clearTimeout(h_postrender),h_postrender=setTimeout(asyncPostProcessRows,options.asyncPostRenderDelay))}function invalidatePostProcessingResults(e){delete postProcessedRows[e],postProcessFromRow=Math.min(postProcessFromRow,e),postProcessToRow=Math.max(postProcessToRow,e),startPostProcessing()}function updateRowPositions(){for(var e in rowsCache)rowsCache[e].rowNode.style.top=getRowTop(e)+"px"}function render(){if(initialized){var e=getVisibleRange(),t=getRenderedRange();cleanupRows(t),lastRenderedScrollLeft!=scrollLeft&&cleanUpAndRenderCells(t),renderRows(t),postProcessFromRow=e.top,postProcessToRow=Math.min(getDataLengthIncludingAddNew()-1,e.bottom),startPostProcessing(),lastRenderedScrollTop=scrollTop,lastRenderedScrollLeft=scrollLeft,h_render=null}}function handleHeaderRowScroll(){var e=$headerRowScroller[0].scrollLeft;e!=$viewport[0].scrollLeft&&($viewport[0].scrollLeft=e)}function handleScroll(){scrollTop=$viewport[0].scrollTop,scrollLeft=$viewport[0].scrollLeft;var e=Math.abs(scrollTop-prevScrollTop),t=Math.abs(scrollLeft-prevScrollLeft);if(t&&(prevScrollLeft=scrollLeft,$headerScroller[0].scrollLeft=scrollLeft,$topPanelScroller[0].scrollLeft=scrollLeft,$headerRowScroller[0].scrollLeft=scrollLeft),e)if(vScrollDir=scrollTop>prevScrollTop?1:-1,prevScrollTop=scrollTop,viewportH>e)scrollTo(scrollTop+offset);else{var o=offset;page=h==viewportH?0:Math.min(n-1,Math.floor(scrollTop*((th-viewportH)/(h-viewportH))*(1/ph))),offset=Math.round(page*cj),o!=offset&&invalidateAllRows()}(t||e)&&(h_render&&clearTimeout(h_render),(Math.abs(lastRenderedScrollTop-scrollTop)>20||Math.abs(lastRenderedScrollLeft-scrollLeft)>20)&&(options.forceSyncScrolling||Math.abs(lastRenderedScrollTop-scrollTop)<viewportH&&Math.abs(lastRenderedScrollLeft-scrollLeft)<viewportW?render():h_render=setTimeout(render,50),trigger(self.onViewportChanged,{}))),trigger(self.onScroll,{scrollLeft:scrollLeft,scrollTop:scrollTop})}function asyncPostProcessRows(){for(var e=getDataLength();postProcessToRow>=postProcessFromRow;){var t=vScrollDir>=0?postProcessFromRow++:postProcessToRow--,o=rowsCache[t];if(o&&!(t>=e)){postProcessedRows[t]||(postProcessedRows[t]={}),ensureCellNodesInRowsCache(t);for(var l in o.cellNodesByColumnIdx)if(o.cellNodesByColumnIdx.hasOwnProperty(l)){l=0|l;var n=columns[l];if(n.asyncPostRender&&!postProcessedRows[t][l]){var i=o.cellNodesByColumnIdx[l];i&&n.asyncPostRender(i,t,getDataItem(t),n),postProcessedRows[t][l]=!0}}return void(h_postrender=setTimeout(asyncPostProcessRows,options.asyncPostRenderDelay))}}}function updateCellCssStylesOnRenderedRows(e,t){var o,l,n,i;for(var r in rowsCache){if(i=t&&t[r],n=e&&e[r],i)for(l in i)n&&i[l]==n[l]||(o=getCellNode(r,getColumnIndex(l)),o&&$(o).removeClass(i[l]));if(n)for(l in n)i&&i[l]==n[l]||(o=getCellNode(r,getColumnIndex(l)),o&&$(o).addClass(n[l]))}}function addCellCssStyles(e,t){if(cellCssClasses[e])throw"addCellCssStyles: cell CSS hash with key '"+e+"' already exists.";cellCssClasses[e]=t,updateCellCssStylesOnRenderedRows(t,null),trigger(self.onCellCssStylesChanged,{key:e,hash:t})}function removeCellCssStyles(e){cellCssClasses[e]&&(updateCellCssStylesOnRenderedRows(null,cellCssClasses[e]),delete cellCssClasses[e],trigger(self.onCellCssStylesChanged,{key:e,hash:null}))}function setCellCssStyles(e,t){var o=cellCssClasses[e];cellCssClasses[e]=t,updateCellCssStylesOnRenderedRows(t,o),trigger(self.onCellCssStylesChanged,{key:e,hash:t})}function getCellCssStyles(e){return cellCssClasses[e]}function flashCell(e,t,o){function l(e){e&&setTimeout(function(){n.queue(function(){n.toggleClass(options.cellFlashingCssClass).dequeue(),l(e-1)})},o)}if(o=o||100,rowsCache[e]){var n=$(getCellNode(e,t));l(4)}}function handleMouseWheel(e){var t=$(e.target).closest(".slick-row")[0];t!=rowNodeFromLastMouseWheelEvent&&(zombieRowNodeFromLastMouseWheelEvent&&zombieRowNodeFromLastMouseWheelEvent!=t&&($canvas[0].removeChild(zombieRowNodeFromLastMouseWheelEvent),zombieRowNodeFromLastMouseWheelEvent=null),rowNodeFromLastMouseWheelEvent=t)}function handleDragInit(e,t){var o=getCellFromEvent(e);if(!o||!cellExists(o.row,o.cell))return!1;var l=trigger(self.onDragInit,t,e);return e.isImmediatePropagationStopped()?l:!1}function handleDragStart(e,t){var o=getCellFromEvent(e);if(!o||!cellExists(o.row,o.cell))return!1;var l=trigger(self.onDragStart,t,e);return e.isImmediatePropagationStopped()?l:!1}function handleDrag(e,t){return trigger(self.onDrag,t,e)}function handleDragEnd(e,t){trigger(self.onDragEnd,t,e)}function handleKeyDown(e){trigger(self.onKeyDown,{row:activeRow,cell:activeCell},e);var t=e.isImmediatePropagationStopped();if(!t)if(e.shiftKey||e.altKey||e.ctrlKey)9!=e.which||!e.shiftKey||e.ctrlKey||e.altKey||(t=navigatePrev());else if(27==e.which){if(!getEditorLock().isActive())return;cancelEditAndSetFocus()}else 34==e.which?(navigatePageDown(),t=!0):33==e.which?(navigatePageUp(),t=!0):37==e.which?t=navigateLeft():39==e.which?t=navigateRight():38==e.which?t=navigateUp():40==e.which?t=navigateDown():9==e.which?t=navigateNext():13==e.which&&(options.editable&&(currentEditor?activeRow===getDataLength()?navigateDown():commitEditAndSetFocus():getEditorLock().commitCurrentEdit()&&makeActiveCellEditable()),t=!0);if(t){e.stopPropagation(),e.preventDefault();try{e.originalEvent.keyCode=0}catch(o){}}}function handleClick(e){currentEditor||(e.target!=document.activeElement||$(e.target).hasClass("slick-cell"))&&setFocus();var t=getCellFromEvent(e);!t||null!==currentEditor&&activeRow==t.row&&activeCell==t.cell||(trigger(self.onClick,{row:t.row,cell:t.cell},e),e.isImmediatePropagationStopped()||activeCell==t.cell&&activeRow==t.row||!canCellBeActive(t.row,t.cell)||(!getEditorLock().isActive()||getEditorLock().commitCurrentEdit())&&(scrollRowIntoView(t.row,!1),setActiveCellInternal(getCellNode(t.row,t.cell))))}function handleContextMenu(e){var t=$(e.target).closest(".slick-cell",$canvas);0!==t.length&&(activeCellNode!==t[0]||null===currentEditor)&&trigger(self.onContextMenu,{},e)}function handleDblClick(e){var t=getCellFromEvent(e);!t||null!==currentEditor&&activeRow==t.row&&activeCell==t.cell||(trigger(self.onDblClick,{row:t.row,cell:t.cell},e),e.isImmediatePropagationStopped()||options.editable&&gotoCell(t.row,t.cell,!0))}function handleHeaderMouseEnter(e){trigger(self.onHeaderMouseEnter,{column:$(this).data("column")},e)}function handleHeaderMouseLeave(e){trigger(self.onHeaderMouseLeave,{column:$(this).data("column")},e)}function handleHeaderContextMenu(e){var t=$(e.target).closest(".slick-header-column",".slick-header-columns"),o=t&&t.data("column");trigger(self.onHeaderContextMenu,{column:o},e)}function handleHeaderClick(e){var t=$(e.target).closest(".slick-header-column",".slick-header-columns"),o=t&&t.data("column");o&&trigger(self.onHeaderClick,{column:o},e)}function handleMouseEnter(e){trigger(self.onMouseEnter,{},e)}function handleMouseLeave(e){trigger(self.onMouseLeave,{},e)}function cellExists(e,t){return!(0>e||e>=getDataLength()||0>t||t>=columns.length)}function getCellFromPoint(e,t){for(var o=getRowFromPosition(t),l=0,n=0,i=0;i<columns.length&&e>n;i++)n+=columns[i].width,l++;return 0>l&&(l=0),{row:o,cell:l-1}}function getCellFromNode(e){var t=/l\d+/.exec(e.className);if(!t)throw"getCellFromNode: cannot get cell - "+e.className;return parseInt(t[0].substr(1,t[0].length-1),10)}function getRowFromNode(e){for(var t in rowsCache)if(rowsCache[t].rowNode===e)return 0|t;return null}function getCellFromEvent(e){var t=$(e.target).closest(".slick-cell",$canvas);if(!t.length)return null;var o=getRowFromNode(t[0].parentNode),l=getCellFromNode(t[0]);return null==o||null==l?null:{row:o,cell:l}}function getCellNodeBox(e,t){if(!cellExists(e,t))return null;for(var o=getRowTop(e),l=o+options.rowHeight-1,n=0,i=0;t>i;i++)n+=columns[i].width;var r=n+columns[t].width;return{top:o,left:n,bottom:l,right:r}}function resetActiveCell(){setActiveCellInternal(null,!1)}function setFocus(){-1==tabbingDirection?$focusSink[0].focus():$focusSink2[0].focus()}function scrollCellIntoView(e,t,o){scrollRowIntoView(e,o);var l=getColspan(e,t),n=columnPosLeft[t],i=columnPosRight[t+(l>1?l-1:0)],r=scrollLeft+viewportW;scrollLeft>n?($viewport.scrollLeft(n),handleScroll(),render()):i>r&&($viewport.scrollLeft(Math.min(n,i-$viewport[0].clientWidth)),handleScroll(),render())}function setActiveCellInternal(e,t){null!==activeCellNode&&(makeActiveCellNormal(),$(activeCellNode).removeClass("active"),rowsCache[activeRow]&&$(rowsCache[activeRow].rowNode).removeClass("active"));var o=activeCellNode!==e;activeCellNode=e,null!=activeCellNode?(activeRow=getRowFromNode(activeCellNode.parentNode),activeCell=activePosX=getCellFromNode(activeCellNode),null==t&&(t=activeRow==getDataLength()||options.autoEdit),$(activeCellNode).addClass("active"),$(rowsCache[activeRow].rowNode).addClass("active"),options.editable&&t&&isCellPotentiallyEditable(activeRow,activeCell)&&(clearTimeout(h_editorLoader),options.asyncEditorLoading?h_editorLoader=setTimeout(function(){makeActiveCellEditable()},options.asyncEditorLoadDelay):makeActiveCellEditable())):activeRow=activeCell=null,o&&trigger(self.onActiveCellChanged,getActiveCell())}function clearTextSelection(){if(document.selection&&document.selection.empty)try{document.selection.empty()}catch(e){}else if(window.getSelection){var t=window.getSelection();t&&t.removeAllRanges&&t.removeAllRanges()}}function isCellPotentiallyEditable(e,t){var o=getDataLength();return o>e&&!getDataItem(e)?!1:columns[t].cannotTriggerInsert&&e>=o?!1:getEditor(e,t)?!0:!1}function makeActiveCellNormal(){if(currentEditor){if(trigger(self.onBeforeCellEditorDestroy,{editor:currentEditor}),currentEditor.destroy(),currentEditor=null,activeCellNode){var e=getDataItem(activeRow);if($(activeCellNode).removeClass("editable invalid"),e){var t=columns[activeCell],o=getFormatter(activeRow,t);activeCellNode.innerHTML=o(activeRow,activeCell,getDataItemValueForColumn(e,t),t,e),invalidatePostProcessingResults(activeRow)}}navigator.userAgent.toLowerCase().match(/msie/)&&clearTextSelection(),getEditorLock().deactivate(editController)}}function makeActiveCellEditable(e){if(activeCellNode){if(!options.editable)throw"Grid : makeActiveCellEditable : should never get called when options.editable is false";if(clearTimeout(h_editorLoader),isCellPotentiallyEditable(activeRow,activeCell)){var t=columns[activeCell],o=getDataItem(activeRow);if(trigger(self.onBeforeEditCell,{row:activeRow,cell:activeCell,item:o,column:t})===!1)return void setFocus();getEditorLock().activate(editController),$(activeCellNode).addClass("editable"),e||(activeCellNode.innerHTML=""),currentEditor=new(e||getEditor(activeRow,activeCell))({grid:self,gridPosition:absBox($container[0]),position:absBox(activeCellNode),container:activeCellNode,column:t,item:o||{},commitChanges:commitEditAndSetFocus,cancelChanges:cancelEditAndSetFocus}),o&&currentEditor.loadValue(o),serializedEditorValue=currentEditor.serializeValue(),currentEditor.position&&handleActiveCellPositionChange()}}}function commitEditAndSetFocus(){getEditorLock().commitCurrentEdit()&&(setFocus(),options.autoEdit&&navigateDown())}function cancelEditAndSetFocus(){getEditorLock().cancelCurrentEdit()&&setFocus()}function absBox(e){var t={top:e.offsetTop,left:e.offsetLeft,bottom:0,right:0,width:$(e).outerWidth(),height:$(e).outerHeight(),visible:!0};t.bottom=t.top+t.height,t.right=t.left+t.width;for(var o=e.offsetParent;(e=e.parentNode)!=document.body;)t.visible&&e.scrollHeight!=e.offsetHeight&&"visible"!=$(e).css("overflowY")&&(t.visible=t.bottom>e.scrollTop&&t.top<e.scrollTop+e.clientHeight),t.visible&&e.scrollWidth!=e.offsetWidth&&"visible"!=$(e).css("overflowX")&&(t.visible=t.right>e.scrollLeft&&t.left<e.scrollLeft+e.clientWidth),t.left-=e.scrollLeft,t.top-=e.scrollTop,e===o&&(t.left+=e.offsetLeft,t.top+=e.offsetTop,o=e.offsetParent),t.bottom=t.top+t.height,t.right=t.left+t.width;return t}function getActiveCellPosition(){return absBox(activeCellNode)}function getGridPosition(){return absBox($container[0])}function handleActiveCellPositionChange(){if(activeCellNode&&(trigger(self.onActiveCellPositionChanged,{}),currentEditor)){var e=getActiveCellPosition();currentEditor.show&&currentEditor.hide&&(e.visible?currentEditor.show():currentEditor.hide()),currentEditor.position&&currentEditor.position(e)}}function getCellEditor(){return currentEditor}function getActiveCell(){return activeCellNode?{row:activeRow,cell:activeCell}:null}function getActiveCellNode(){return activeCellNode}function scrollRowIntoView(e,t){var o=e*options.rowHeight,l=(e+1)*options.rowHeight-viewportH+(viewportHasHScroll?scrollbarDimensions.height:0);(e+1)*options.rowHeight>scrollTop+viewportH+offset?(scrollTo(t?o:l),render()):e*options.rowHeight<scrollTop+offset&&(scrollTo(t?l:o),render())}function scrollRowToTop(e){scrollTo(e*options.rowHeight),render()}function scrollPage(e){var t=e*numVisibleRows;if(scrollTo((getRowFromPosition(scrollTop)+t)*options.rowHeight),render(),options.enableCellNavigation&&null!=activeRow){var o=activeRow+t,l=getDataLengthIncludingAddNew();o>=l&&(o=l-1),0>o&&(o=0);for(var n=0,i=null,r=activePosX;activePosX>=n;)canCellBeActive(o,n)&&(i=n),n+=getColspan(o,n);null!==i?(setActiveCellInternal(getCellNode(o,i)),activePosX=r):resetActiveCell()}}function navigatePageDown(){scrollPage(1)}function navigatePageUp(){scrollPage(-1)}function getColspan(e,t){var o=data.getItemMetadata&&data.getItemMetadata(e);if(!o||!o.columns)return 1;var l=o.columns[columns[t].id]||o.columns[t],n=l&&l.colspan;return n="*"===n?columns.length-t:n||1}function findFirstFocusableCell(e){for(var t=0;t<columns.length;){if(canCellBeActive(e,t))return t;t+=getColspan(e,t)}return null}function findLastFocusableCell(e){for(var t=0,o=null;t<columns.length;)canCellBeActive(e,t)&&(o=t),t+=getColspan(e,t);return o}function gotoRight(e,t,o){if(t>=columns.length)return null;do t+=getColspan(e,t);while(t<columns.length&&!canCellBeActive(e,t));return t<columns.length?{row:e,cell:t,posX:t}:null}function gotoLeft(e,t,o){if(0>=t)return null;var l=findFirstFocusableCell(e);if(null===l||l>=t)return null;for(var n,i={row:e,cell:l,posX:l};;){if(n=gotoRight(i.row,i.cell,i.posX),!n)return null;if(n.cell>=t)return i;i=n}}function gotoDown(e,t,o){for(var l,n=getDataLengthIncludingAddNew();;){if(++e>=n)return null;for(l=t=0;o>=t;)l=t,t+=getColspan(e,t);if(canCellBeActive(e,l))return{row:e,cell:l,posX:o}}}function gotoUp(e,t,o){for(var l;;){if(--e<0)return null;for(l=t=0;o>=t;)l=t,t+=getColspan(e,t);if(canCellBeActive(e,l))return{row:e,cell:l,posX:o}}}function gotoNext(e,t,o){if(null==e&&null==t&&(e=t=o=0,canCellBeActive(e,t)))return{row:e,cell:t,posX:t};var l=gotoRight(e,t,o);if(l)return l;for(var n=null,i=getDataLengthIncludingAddNew();++e<i;)if(n=findFirstFocusableCell(e),null!==n)return{row:e,cell:n,posX:n};return null}function gotoPrev(e,t,o){if(null==e&&null==t&&(e=getDataLengthIncludingAddNew()-1,t=o=columns.length-1,canCellBeActive(e,t)))return{row:e,cell:t,posX:t};for(var l,n;!l&&!(l=gotoLeft(e,t,o));){if(--e<0)return null;t=0,n=findLastFocusableCell(e),null!==n&&(l={row:e,cell:n,posX:n})}return l}function navigateRight(){return navigate("right")}function navigateLeft(){return navigate("left")}function navigateDown(){return navigate("down")}function navigateUp(){return navigate("up")}function navigateNext(){return navigate("next")}function navigatePrev(){return navigate("prev")}function navigate(e){if(!options.enableCellNavigation)return!1;if(!activeCellNode&&"prev"!=e&&"next"!=e)return!1;if(!getEditorLock().commitCurrentEdit())return!0;setFocus();var t={up:-1,down:1,left:-1,right:1,prev:-1,next:1};tabbingDirection=t[e];var o={up:gotoUp,down:gotoDown,left:gotoLeft,right:gotoRight,prev:gotoPrev,next:gotoNext},l=o[e],n=l(activeRow,activeCell,activePosX);if(n){var i=n.row==getDataLength();return scrollCellIntoView(n.row,n.cell,!i),setActiveCellInternal(getCellNode(n.row,n.cell)),activePosX=n.posX,!0}return setActiveCellInternal(getCellNode(activeRow,activeCell)),!1}function getCellNode(e,t){return rowsCache[e]?(ensureCellNodesInRowsCache(e),rowsCache[e].cellNodesByColumnIdx[t]):null}function setActiveCell(e,t){initialized&&(e>getDataLength()||0>e||t>=columns.length||0>t||options.enableCellNavigation&&(scrollCellIntoView(e,t,!1),setActiveCellInternal(getCellNode(e,t),!1)))}function canCellBeActive(e,t){if(!options.enableCellNavigation||e>=getDataLengthIncludingAddNew()||0>e||t>=columns.length||0>t)return!1;var o=data.getItemMetadata&&data.getItemMetadata(e);if(o&&"boolean"==typeof o.focusable)return o.focusable;var l=o&&o.columns;return l&&l[columns[t].id]&&"boolean"==typeof l[columns[t].id].focusable?l[columns[t].id].focusable:l&&l[t]&&"boolean"==typeof l[t].focusable?l[t].focusable:columns[t].focusable}function canCellBeSelected(e,t){if(e>=getDataLength()||0>e||t>=columns.length||0>t)return!1;var o=data.getItemMetadata&&data.getItemMetadata(e);if(o&&"boolean"==typeof o.selectable)return o.selectable;var l=o&&o.columns&&(o.columns[columns[t].id]||o.columns[t]);return l&&"boolean"==typeof l.selectable?l.selectable:columns[t].selectable}function gotoCell(e,t,o){if(initialized&&canCellBeActive(e,t)&&getEditorLock().commitCurrentEdit()){scrollCellIntoView(e,t,!1);var l=getCellNode(e,t);setActiveCellInternal(l,o||e===getDataLength()||options.autoEdit),currentEditor||setFocus()}}function commitCurrentEdit(){var e=getDataItem(activeRow),t=columns[activeCell];if(currentEditor){if(currentEditor.isValueChanged()){var o=currentEditor.validate();if(o.valid){if(activeRow<getDataLength()){var l={row:activeRow,cell:activeCell,editor:currentEditor,serializedValue:currentEditor.serializeValue(),prevSerializedValue:serializedEditorValue,execute:function(){this.editor.applyValue(e,this.serializedValue),updateRow(this.row),trigger(self.onCellChange,{row:activeRow,cell:activeCell,item:e})},undo:function(){this.editor.applyValue(e,this.prevSerializedValue),updateRow(this.row),trigger(self.onCellChange,{row:activeRow,cell:activeCell,item:e})}};options.editCommandHandler?(makeActiveCellNormal(),options.editCommandHandler(e,t,l)):(l.execute(),makeActiveCellNormal())}else{var n={};currentEditor.applyValue(n,currentEditor.serializeValue()),makeActiveCellNormal(),trigger(self.onAddNewRow,{item:n,column:t})}return!getEditorLock().isActive()}return $(activeCellNode).removeClass("invalid"),$(activeCellNode).width(),$(activeCellNode).addClass("invalid"),trigger(self.onValidationError,{editor:currentEditor,cellNode:activeCellNode,validationResults:o,row:activeRow,cell:activeCell,column:t}),currentEditor.focus(),!1}makeActiveCellNormal()}return!0}function cancelCurrentEdit(){return makeActiveCellNormal(),!0}function rowsToRanges(e){for(var t=[],o=columns.length-1,l=0;l<e.length;l++)t.push(new Slick.Range(e[l],0,e[l],o));return t}function getSelectedRows(){if(!selectionModel)throw"Selection model is not set";return selectedRows}function setSelectedRows(e){if(!selectionModel)throw"Selection model is not set";selectionModel.setSelectedRanges(rowsToRanges(e))}var defaults={explicitInitialization:!1,rowHeight:25,defaultColumnWidth:80,enableAddRow:!1,leaveSpaceForNewRows:!1,editable:!1,autoEdit:!0,enableCellNavigation:!0,enableColumnReorder:!0,asyncEditorLoading:!1,asyncEditorLoadDelay:100,forceFitColumns:!1,enableAsyncPostRender:!1,asyncPostRenderDelay:50,autoHeight:!1,editorLock:Slick.GlobalEditorLock,showHeaderRow:!1,headerRowHeight:25,showTopPanel:!1,topPanelHeight:25,formatterFactory:null,editorFactory:null,cellFlashingCssClass:"flashing",selectedCellCssClass:"selected",multiSelect:!0,enableTextSelectionOnCells:!1,dataItemColumnValueExtractor:null,fullWidthRows:!1,multiColumnSort:!1,defaultFormatter:defaultFormatter,forceSyncScrolling:!1,addNewRowCssClass:"new-row"},columnDefaults={name:"",resizable:!0,sortable:!1,minWidth:30,rerenderOnResize:!1,headerCssClass:null,defaultSortAsc:!0,focusable:!0,selectable:!0},th,h,ph,n,cj,page=0,offset=0,vScrollDir=1,initialized=!1,$container,uid="slickgrid_"+Math.round(1e6*Math.random()),self=this,$focusSink,$focusSink2,$headerScroller,$headers,$headerRow,$headerRowScroller,$headerRowSpacer,$topPanelScroller,$topPanel,$viewport,$canvas,$style,$boundAncestors,stylesheet,columnCssRulesL,columnCssRulesR,viewportH,viewportW,canvasWidth,viewportHasHScroll,viewportHasVScroll,headerColumnWidthDiff=0,headerColumnHeightDiff=0,cellWidthDiff=0,cellHeightDiff=0,absoluteColumnMinWidth,tabbingDirection=1,activePosX,activeRow,activeCell,activeCellNode=null,currentEditor=null,serializedEditorValue,editController,rowsCache={},renderedRows=0,numVisibleRows,prevScrollTop=0,scrollTop=0,lastRenderedScrollTop=0,lastRenderedScrollLeft=0,prevScrollLeft=0,scrollLeft=0,selectionModel,selectedRows=[],plugins=[],cellCssClasses={},columnsById={},sortColumns=[],columnPosLeft=[],columnPosRight=[],h_editorLoader=null,h_render=null,h_postrender=null,postProcessedRows={},postProcessToRow=null,postProcessFromRow=null,counter_rows_rendered=0,counter_rows_removed=0,rowNodeFromLastMouseWheelEvent,zombieRowNodeFromLastMouseWheelEvent;this.debug=function(){var e="";e+="\ncounter_rows_rendered:  "+counter_rows_rendered,e+="\ncounter_rows_removed:  "+counter_rows_removed,e+="\nrenderedRows:  "+renderedRows,e+="\nnumVisibleRows:  "+numVisibleRows,e+="\nmaxSupportedCssHeight:  "+maxSupportedCssHeight,e+="\nn(umber of pages):  "+n,e+="\n(current) page:  "+page,e+="\npage height (ph):  "+ph,e+="\nvScrollDir:  "+vScrollDir,alert(e)},this.eval=function(expr){return eval(expr)},$.extend(this,{slickGridVersion:"2.1",onScroll:new Slick.Event,onSort:new Slick.Event,onHeaderMouseEnter:new Slick.Event,onHeaderMouseLeave:new Slick.Event,onHeaderContextMenu:new Slick.Event,onHeaderClick:new Slick.Event,onHeaderCellRendered:new Slick.Event,onBeforeHeaderCellDestroy:new Slick.Event,onHeaderRowCellRendered:new Slick.Event,onBeforeHeaderRowCellDestroy:new Slick.Event,onMouseEnter:new Slick.Event,onMouseLeave:new Slick.Event,onClick:new Slick.Event,onDblClick:new Slick.Event,onContextMenu:new Slick.Event,onKeyDown:new Slick.Event,onAddNewRow:new Slick.Event,onValidationError:new Slick.Event,onViewportChanged:new Slick.Event,onColumnsReordered:new Slick.Event,onColumnsResized:new Slick.Event,onCellChange:new Slick.Event,onBeforeEditCell:new Slick.Event,onBeforeCellEditorDestroy:new Slick.Event,onBeforeDestroy:new Slick.Event,onActiveCellChanged:new Slick.Event,onActiveCellPositionChanged:new Slick.Event,onDragInit:new Slick.Event,onDragStart:new Slick.Event,onDrag:new Slick.Event,onDragEnd:new Slick.Event,onSelectedRowsChanged:new Slick.Event,onCellCssStylesChanged:new Slick.Event,registerPlugin:registerPlugin,unregisterPlugin:unregisterPlugin,getColumns:getColumns,setColumns:setColumns,getColumnIndex:getColumnIndex,updateColumnHeader:updateColumnHeader,setSortColumn:setSortColumn,setSortColumns:setSortColumns,getSortColumns:getSortColumns,autosizeColumns:autosizeColumns,getOptions:getOptions,setOptions:setOptions,getData:getData,getDataLength:getDataLength,getDataItem:getDataItem,setData:setData,getSelectionModel:getSelectionModel,setSelectionModel:setSelectionModel,getSelectedRows:getSelectedRows,setSelectedRows:setSelectedRows,getContainerNode:getContainerNode,render:render,invalidate:invalidate,invalidateRow:invalidateRow,invalidateRows:invalidateRows,invalidateAllRows:invalidateAllRows,updateCell:updateCell,updateRow:updateRow,getViewport:getVisibleRange,getRenderedRange:getRenderedRange,resizeCanvas:resizeCanvas,updateRowCount:updateRowCount,scrollRowIntoView:scrollRowIntoView,scrollRowToTop:scrollRowToTop,scrollCellIntoView:scrollCellIntoView,getCanvasNode:getCanvasNode,focus:setFocus,getCellFromPoint:getCellFromPoint,getCellFromEvent:getCellFromEvent,getActiveCell:getActiveCell,setActiveCell:setActiveCell,getActiveCellNode:getActiveCellNode,getActiveCellPosition:getActiveCellPosition,resetActiveCell:resetActiveCell,editActiveCell:makeActiveCellEditable,getCellEditor:getCellEditor,getCellNode:getCellNode,getCellNodeBox:getCellNodeBox,canCellBeSelected:canCellBeSelected,canCellBeActive:canCellBeActive,navigatePrev:navigatePrev,navigateNext:navigateNext,navigateUp:navigateUp,navigateDown:navigateDown,navigateLeft:navigateLeft,navigateRight:navigateRight,navigatePageUp:navigatePageUp,navigatePageDown:navigatePageDown,gotoCell:gotoCell,getTopPanel:getTopPanel,setTopPanelVisibility:setTopPanelVisibility,setHeaderRowVisibility:setHeaderRowVisibility,getHeaderRow:getHeaderRow,getHeaderRowColumn:getHeaderRowColumn,getGridPosition:getGridPosition,flashCell:flashCell,addCellCssStyles:addCellCssStyles,setCellCssStyles:setCellCssStyles,removeCellCssStyles:removeCellCssStyles,getCellCssStyles:getCellCssStyles,init:finishInitialization,destroy:destroy,getEditorLock:getEditorLock,getEditController:getEditController}),init()}$.extend(!0,window,{Slick:{Grid:SlickGrid}});var scrollbarDimensions,maxSupportedCssHeight}(jQuery);

// Slick Editors
!function(e){function t(t){var i,n;this.init=function(){i=e("<INPUT type=text class='editor-text' />").appendTo(t.container).bind("keydown.nav",function(t){(t.keyCode===e.ui.keyCode.LEFT||t.keyCode===e.ui.keyCode.RIGHT)&&t.stopImmediatePropagation()}).focus().select()},this.destroy=function(){i.remove()},this.focus=function(){i.focus()},this.getValue=function(){return i.val()},this.setValue=function(e){i.val(e)},this.loadValue=function(e){n=e[t.column.field]||"",i.val(n),i[0].defaultValue=n,i.select()},this.serializeValue=function(){return i.val()},this.applyValue=function(e,i){e[t.column.field]=i},this.isValueChanged=function(){return!(""==i.val()&&null==n)&&i.val()!=n},this.validate=function(){if(t.column.validator){var e=t.column.validator(i.val());if(!e.valid)return e}return{valid:!0,msg:null}},this.init()}function i(t){var i,n;this.init=function(){i=e("<INPUT type=text class='editor-text' />"),i.bind("keydown.nav",function(t){(t.keyCode===e.ui.keyCode.LEFT||t.keyCode===e.ui.keyCode.RIGHT)&&t.stopImmediatePropagation()}),i.appendTo(t.container),i.focus().select()},this.destroy=function(){i.remove()},this.focus=function(){i.focus()},this.loadValue=function(e){n=e[t.column.field],i.val(n),i[0].defaultValue=n,i.select()},this.serializeValue=function(){return parseInt(i.val(),10)||0},this.applyValue=function(e,i){e[t.column.field]=i},this.isValueChanged=function(){return!(""==i.val()&&null==n)&&i.val()!=n},this.validate=function(){return isNaN(i.val())?{valid:!1,msg:"Please enter a valid integer"}:{valid:!0,msg:null}},this.init()}function n(t){var i,n,o=!1;this.init=function(){i=e("<INPUT type=text class='editor-text' />"),i.appendTo(t.container),i.focus().select(),i.datepicker({showOn:"button",buttonImageOnly:!0,buttonImage:"../images/calendar.gif",beforeShow:function(){o=!0},onClose:function(){o=!1}}),i.width(i.width()-18)},this.destroy=function(){e.datepicker.dpDiv.stop(!0,!0),i.datepicker("hide"),i.datepicker("destroy"),i.remove()},this.show=function(){o&&e.datepicker.dpDiv.stop(!0,!0).show()},this.hide=function(){o&&e.datepicker.dpDiv.stop(!0,!0).hide()},this.position=function(t){o&&e.datepicker.dpDiv.css("top",t.top+30).css("left",t.left)},this.focus=function(){i.focus()},this.loadValue=function(e){n=e[t.column.field],i.val(n),i[0].defaultValue=n,i.select()},this.serializeValue=function(){return i.val()},this.applyValue=function(e,i){e[t.column.field]=i},this.isValueChanged=function(){return!(""==i.val()&&null==n)&&i.val()!=n},this.validate=function(){return{valid:!0,msg:null}},this.init()}function o(t){var i,n;this.init=function(){i=e("<SELECT tabIndex='0' class='editor-yesno'><OPTION value='yes'>Yes</OPTION><OPTION value='no'>No</OPTION></SELECT>"),i.appendTo(t.container),i.focus()},this.destroy=function(){i.remove()},this.focus=function(){i.focus()},this.loadValue=function(e){i.val((n=e[t.column.field])?"yes":"no"),i.select()},this.serializeValue=function(){return"yes"==i.val()},this.applyValue=function(e,i){e[t.column.field]=i},this.isValueChanged=function(){return i.val()!=n},this.validate=function(){return{valid:!0,msg:null}},this.init()}function l(t){var i,n;this.init=function(){i=e("<INPUT type=checkbox value='true' class='editor-checkbox' hideFocus>"),i.appendTo(t.container),i.focus()},this.destroy=function(){i.remove()},this.focus=function(){i.focus()},this.loadValue=function(e){n=!!e[t.column.field],n?i.prop("checked",!0):i.prop("checked",!1)},this.serializeValue=function(){return i.prop("checked")},this.applyValue=function(e,i){e[t.column.field]=i},this.isValueChanged=function(){return this.serializeValue()!==n},this.validate=function(){return{valid:!0,msg:null}},this.init()}function a(t){var i,n,o;this.init=function(){i=e("<INPUT type=text class='editor-percentcomplete' />"),i.width(e(t.container).innerWidth()-25),i.appendTo(t.container),n=e("<div class='editor-percentcomplete-picker' />").appendTo(t.container),n.append("<div class='editor-percentcomplete-helper'><div class='editor-percentcomplete-wrapper'><div class='editor-percentcomplete-slider' /><div class='editor-percentcomplete-buttons' /></div></div>"),n.find(".editor-percentcomplete-buttons").append("<button val=0>Not started</button><br/><button val=50>In Progress</button><br/><button val=100>Complete</button>"),i.focus().select(),n.find(".editor-percentcomplete-slider").slider({orientation:"vertical",range:"min",value:o,slide:function(e,t){i.val(t.value)}}),n.find(".editor-percentcomplete-buttons button").bind("click",function(t){i.val(e(this).attr("val")),n.find(".editor-percentcomplete-slider").slider("value",e(this).attr("val"))})},this.destroy=function(){i.remove(),n.remove()},this.focus=function(){i.focus()},this.loadValue=function(e){i.val(o=e[t.column.field]),i.select()},this.serializeValue=function(){return parseInt(i.val(),10)||0},this.applyValue=function(e,i){e[t.column.field]=i},this.isValueChanged=function(){return!(""==i.val()&&null==o)&&(parseInt(i.val(),10)||0)!=o},this.validate=function(){return isNaN(parseInt(i.val(),10))?{valid:!1,msg:"Please enter a valid positive number"}:{valid:!0,msg:null}},this.init()}function s(t){var i,n,o,l=this;this.init=function(){var o=e("body");n=e("<DIV style='z-index:10000;position:absolute;background:white;padding:5px;border:3px solid gray; -moz-border-radius:10px; border-radius:10px;'/>").appendTo(o),i=e("<TEXTAREA hidefocus rows=5 style='backround:white;width:250px;height:80px;border:0;outline:0'>").appendTo(n),e("<DIV style='text-align:right'><BUTTON>Save</BUTTON><BUTTON>Cancel</BUTTON></DIV>").appendTo(n),n.find("button:first").bind("click",this.save),n.find("button:last").bind("click",this.cancel),i.bind("keydown",this.handleKeyDown),l.position(t.position),i.focus().select()},this.handleKeyDown=function(i){i.which==e.ui.keyCode.ENTER&&i.ctrlKey?l.save():i.which==e.ui.keyCode.ESCAPE?(i.preventDefault(),l.cancel()):i.which==e.ui.keyCode.TAB&&i.shiftKey?(i.preventDefault(),t.grid.navigatePrev()):i.which==e.ui.keyCode.TAB&&(i.preventDefault(),t.grid.navigateNext())},this.save=function(){t.commitChanges()},this.cancel=function(){i.val(o),t.cancelChanges()},this.hide=function(){n.hide()},this.show=function(){n.show()},this.position=function(e){n.css("top",e.top-5).css("left",e.left-5)},this.destroy=function(){n.remove()},this.focus=function(){i.focus()},this.loadValue=function(e){i.val(o=e[t.column.field]),i.select()},this.serializeValue=function(){return i.val()},this.applyValue=function(e,i){e[t.column.field]=i},this.isValueChanged=function(){return!(""==i.val()&&null==o)&&i.val()!=o},this.validate=function(){return{valid:!0,msg:null}},this.init()}e.extend(!0,window,{Slick:{Editors:{Text:t,Integer:i,Date:n,YesNoSelect:o,Checkbox:l,PercentComplete:a,LongText:s}}})}(jQuery);

// Data View
// !function(t){function e(e){function n(){_t=!0}function i(){_t=!1,et()}function r(t){$t=t}function o(t){at=t}function a(t){t=t||0;for(var e,n=t,i=ft.length;i>n;n++){if(e=ft[n][ct],void 0===e)throw"Each data element must implement a unique 'id' property";ht[e]=n}}function l(){for(var t,e=0,n=ft.length;n>e;e++)if(t=ft[e][ct],void 0===t||ht[t]!==e)throw"Each data element must implement a unique 'id' property"}function s(){return ft}function u(t,e){void 0!==e&&(ct=e),ft=xt=t,ht={},a(),l(),et()}function g(t){void 0!=t.pageSize&&(Ft=t.pageSize,Nt=Ft?Math.min(Nt,Math.max(0,Math.ceil(At/Ft)-1)):0),void 0!=t.pageNum&&(Nt=Math.min(t.pageNum,Math.max(0,Math.ceil(At/Ft)-1))),Et.notify(c(),null,ut),et()}function c(){var t=Ft?Math.max(1,Math.ceil(At/Ft)):1;return{pageSize:Ft,pageNum:Nt,totalRows:At,totalPages:t}}function f(t,e){wt=e,ot=t,rt=null,e===!1&&ft.reverse(),ft.sort(t),e===!1&&ft.reverse(),ht={},a(),et()}function p(t,e){wt=e,rt=t,ot=null;var n=Object.prototype.toString;Object.prototype.toString="function"==typeof t?t:function(){return this[t]},e===!1&&ft.reverse(),ft.sort(),Object.prototype.toString=n,e===!1&&ft.reverse(),ht={},a(),et()}function h(){ot?f(ot,wt):rt&&p(rt,wt)}function d(t){mt=t,e.inlineFilters&&(lt=Q(),st=W()),et()}function m(){return Rt}function v(n){e.groupItemMetadataProvider||(e.groupItemMetadataProvider=new Slick.Data.GroupItemMetadataProvider),St=[],Mt=[],n=n||[],Rt=n instanceof Array?n:[n];for(var i=0;i<Rt.length;i++){var r=Rt[i]=t.extend(!0,{},It,Rt[i]);r.getterIsAFn="function"==typeof r.getter,r.compiledAccumulators=[];for(var o=r.aggregators.length;o--;)r.compiledAccumulators[o]=H(r.aggregators[o]);Mt[i]={}}et()}function _(t,e,n){return null==t?void v([]):void v({getter:t,formatter:e,comparer:n})}function w(t,e){if(!Rt.length)throw new Error("At least one grouping must be specified before calling setAggregators().");Rt[0].aggregators=t,Rt[0].aggregateCollapsed=e,v(Rt)}function $(t){return ft[t]}function y(t){return ht[t]}function x(){if(!dt){dt={};for(var t=0,e=pt.length;e>t;t++)dt[pt[t][ct]]=t}}function C(t){return x(),dt[t]}function I(t){return ft[ht[t]]}function R(t){var e=[];x();for(var n=0,i=t.length;i>n;n++){var r=dt[t[n]];null!=r&&(e[e.length]=r)}return e}function S(t){for(var e=[],n=0,i=t.length;i>n;n++)t[n]<pt.length&&(e[e.length]=pt[t[n]][ct]);return e}function M(t,e){if(void 0===ht[t]||t!==e[ct])throw"Invalid or non-matching id";ft[ht[t]]=e,vt||(vt={}),vt[t]=!0,et()}function b(t,e){ft.splice(t,0,e),a(t),et()}function F(t){ft.push(t),a(ft.length-1),et()}function N(t){var e=ht[t];if(void 0===e)throw"Invalid id";delete ht[t],ft.splice(e,1),a(e),et()}function A(){return pt.length}function G(t){var e=pt[t];if(e&&e.__group&&e.totals&&!e.totals.initialized){var n=Rt[e.level];n.displayTotalsRow||(K(e.totals),e.title=n.formatter?n.formatter(e):e.value)}else e&&e.__groupTotals&&!e.initialized&&K(e);return e}function T(t){var n=pt[t];return void 0===n?null:n.__group?e.groupItemMetadataProvider.getGroupRowMetadata(n):n.__groupTotals?e.groupItemMetadataProvider.getTotalsRowMetadata(n):null}function E(t,e){if(null==t)for(var n=0;n<Rt.length;n++)Mt[n]={},Rt[n].collapsed=e;else Mt[t]={},Rt[t].collapsed=e;et()}function k(t){E(t,!0)}function j(t){E(t,!1)}function D(t,e,n){Mt[t][e]=Rt[t].collapsed^n,et()}function P(t){var e=Array.prototype.slice.call(arguments),n=e[0];1==e.length&&-1!=n.indexOf(bt)?D(n.split(bt).length-1,n,!0):D(e.length-1,e.join(bt),!0)}function z(t){var e=Array.prototype.slice.call(arguments),n=e[0];1==e.length&&-1!=n.indexOf(bt)?D(n.split(bt).length-1,n,!1):D(e.length-1,e.join(bt),!1)}function B(){return St}function O(t,e){for(var n,i,r,o=[],a={},l=e?e.level+1:0,s=Rt[l],u=0,g=s.predefinedValues.length;g>u;u++)i=s.predefinedValues[u],n=a[i],n||(n=new Slick.Group,n.value=i,n.level=l,n.groupingKey=(e?e.groupingKey+bt:"")+i,o[o.length]=n,a[i]=n);for(var u=0,g=t.length;g>u;u++)r=t[u],i=s.getterIsAFn?s.getter(r):r[s.getter],n=a[i],n||(n=new Slick.Group,n.value=i,n.level=l,n.groupingKey=(e?e.groupingKey+bt:"")+i,o[o.length]=n,a[i]=n),n.rows[n.count++]=r;if(l<Rt.length-1)for(var u=0;u<o.length;u++)n=o[u],n.groups=O(n.rows,n);return o.sort(Rt[l].comparer),o}function K(t){var e,n=t.group,i=Rt[n.level],r=n.level==Rt.length,o=i.aggregators.length;if(!r&&i.aggregateChildGroups)for(var a=n.groups.length;a--;)n.groups[a].initialized||K(n.groups[a]);for(;o--;)e=i.aggregators[o],e.init(),!r&&i.aggregateChildGroups?i.compiledAccumulators[o].call(e,n.groups):i.compiledAccumulators[o].call(e,n.rows),e.storeResult(t);t.initialized=!0}function V(t){var e=Rt[t.level],n=new Slick.GroupTotals;n.group=t,t.totals=n,e.lazyTotalsCalculation||K(n)}function q(t,e){e=e||0;for(var n,i=Rt[e],r=i.collapsed,o=Mt[e],a=t.length;a--;)n=t[a],(!n.collapsed||i.aggregateCollapsed)&&(n.groups&&q(n.groups,e+1),i.aggregators.length&&(i.aggregateEmpty||n.rows.length||n.groups&&n.groups.length)&&V(n),n.collapsed=r^o[n.groupingKey],n.title=i.formatter?i.formatter(n):n.value)}function U(t,e){e=e||0;for(var n,i,r=Rt[e],o=[],a=0,l=0,s=t.length;s>l;l++){if(i=t[l],o[a++]=i,!i.collapsed){n=i.groups?U(i.groups,e+1):i.rows;for(var u=0,g=n.length;g>u;u++)o[a++]=n[u]}i.totals&&r.displayTotalsRow&&(!i.collapsed||r.aggregateCollapsed)&&(o[a++]=i.totals)}return o}function L(t){var e=/^function[^(]*\(([^)]*)\)\s*{([\s\S]*)}$/,n=t.toString().match(e);return{params:n[1].split(","),body:n[2]}}function H(t){var e=L(t.accumulate),n=new Function("_items","for (var "+e.params[0]+", _i=0, _il=_items.length; _i<_il; _i++) {"+e.params[0]+" = _items[_i]; "+e.body+"}");return n.displayName=n.name="compiledAccumulatorLoop",n}function Q(){var t=L(mt),e=t.body.replace(/return false\s*([;}]|$)/gi,"{ continue _coreloop; }$1").replace(/return true\s*([;}]|$)/gi,"{ _retval[_idx++] = $item$; continue _coreloop; }$1").replace(/return ([^;}]+?)\s*([;}]|$)/gi,"{ if ($1) { _retval[_idx++] = $item$; }; continue _coreloop; }$2"),n=["var _retval = [], _idx = 0; ","var $item$, $args$ = _args; ","_coreloop: ","for (var _i = 0, _il = _items.length; _i < _il; _i++) { ","$item$ = _items[_i]; ","$filter$; ","} ","return _retval; "].join("");n=n.replace(/\$filter\$/gi,e),n=n.replace(/\$item\$/gi,t.params[0]),n=n.replace(/\$args\$/gi,t.params[1]);var i=new Function("_items,_args",n);return i.displayName=i.name="compiledFilter",i}function W(){var t=L(mt),e=t.body.replace(/return false\s*([;}]|$)/gi,"{ continue _coreloop; }$1").replace(/return true\s*([;}]|$)/gi,"{ _cache[_i] = true;_retval[_idx++] = $item$; continue _coreloop; }$1").replace(/return ([^;}]+?)\s*([;}]|$)/gi,"{ if ((_cache[_i] = $1)) { _retval[_idx++] = $item$; }; continue _coreloop; }$2"),n=["var _retval = [], _idx = 0; ","var $item$, $args$ = _args; ","_coreloop: ","for (var _i = 0, _il = _items.length; _i < _il; _i++) { ","$item$ = _items[_i]; ","if (_cache[_i]) { ","_retval[_idx++] = $item$; ","continue _coreloop; ","} ","$filter$; ","} ","return _retval; "].join("");n=n.replace(/\$filter\$/gi,e),n=n.replace(/\$item\$/gi,t.params[0]),n=n.replace(/\$args\$/gi,t.params[1]);var i=new Function("_items,_args,_cache",n);return i.displayName=i.name="compiledFilterWithCaching",i}function J(t,e){for(var n=[],i=0,r=0,o=t.length;o>r;r++)mt(t[r],e)&&(n[i++]=t[r]);return n}function X(t,e,n){for(var i,r=[],o=0,a=0,l=t.length;l>a;a++)i=t[a],n[a]?r[o++]=i:mt(i,e)&&(r[o++]=i,n[a]=!0);return r}function Y(t){if(mt){var n=e.inlineFilters?lt:J,i=e.inlineFilters?st:X;$t.isFilterNarrowing?xt=n(xt,at):$t.isFilterExpanding?xt=i(t,at,Ct):$t.isFilterUnchanged||(xt=n(t,at))}else xt=Ft?t:t.concat();var r;return Ft?(xt.length<Nt*Ft&&(Nt=Math.floor(xt.length/Ft)),r=xt.slice(Ft*Nt,Ft*Nt+Ft)):r=xt,{totalRows:xt.length,rows:r}}function Z(t,e){var n,i,r,o=[],a=0,l=e.length;$t&&$t.ignoreDiffsBefore&&(a=Math.max(0,Math.min(e.length,$t.ignoreDiffsBefore))),$t&&$t.ignoreDiffsAfter&&(l=Math.min(e.length,Math.max(0,$t.ignoreDiffsAfter)));for(var s=a,u=t.length;l>s;s++)s>=u?o[o.length]=s:(n=e[s],i=t[s],(Rt.length&&(r=n.__nonDataRow||i.__nonDataRow)&&n.__group!==i.__group||n.__group&&!n.equals(i)||r&&(n.__groupTotals||i.__groupTotals)||n[ct]!=i[ct]||vt&&vt[n[ct]])&&(o[o.length]=s));return o}function tt(t){dt=null,($t.isFilterNarrowing!=yt.isFilterNarrowing||$t.isFilterExpanding!=yt.isFilterExpanding)&&(Ct=[]);var e=Y(t);At=e.totalRows;var n=e.rows;St=[],Rt.length&&(St=O(n),St.length&&(q(St),n=U(St)));var i=Z(pt,n);return pt=n,i}function et(){if(!_t){var t=pt.length,e=At,n=tt(ft,mt);Ft&&Nt*Ft>At&&(Nt=Math.max(0,Math.ceil(At/Ft)-1),n=tt(ft,mt)),vt=null,yt=$t,$t={},e!=At&&Et.notify(c(),null,ut),t!=pt.length&&Gt.notify({previous:t,current:pt.length},null,ut),n.length>0&&Tt.notify({rows:n},null,ut)}}function nt(e,n,i){function r(t){s.join(",")!=t.join(",")&&(s=t,u.notify({grid:e,ids:s},new Slick.EventData,l))}function o(){if(s.length>0){a=!0;var t=l.mapIdsToRows(s);n||r(l.mapRowsToIds(t)),e.setSelectedRows(t),a=!1}}var a,l=this,s=l.mapRowsToIds(e.getSelectedRows()),u=new Slick.Event;return e.onSelectedRowsChanged.subscribe(function(n,o){if(!a){var u=l.mapRowsToIds(e.getSelectedRows());if(i&&e.getOptions().multiSelect){var g=t.grep(s,function(t){return void 0===l.getRowById(t)});r(g.concat(u))}else r(u)}}),this.onRowsChanged.subscribe(o),this.onRowCountChanged.subscribe(o),u}function it(t,e){function n(t){r={};for(var e in t){var n=pt[e][ct];r[n]=t[e]}}function i(){if(r){o=!0,x();var n={};for(var i in r){var a=dt[i];void 0!=a&&(n[a]=r[i])}t.setCellCssStyles(e,n),o=!1}}var r,o;n(t.getCellCssStyles(e)),t.onCellCssStylesChanged.subscribe(function(t,i){o||e==i.key&&i.hash&&n(i.hash)}),this.onRowsChanged.subscribe(i),this.onRowCountChanged.subscribe(i)}var rt,ot,at,lt,st,ut=this,gt={groupItemMetadataProvider:null,inlineFilters:!1},ct="id",ft=[],pt=[],ht={},dt=null,mt=null,vt=null,_t=!1,wt=!0,$t={},yt={},xt=[],Ct=[],It={getter:null,formatter:null,comparer:function(t,e){return t.value-e.value},predefinedValues:[],aggregators:[],aggregateEmpty:!1,aggregateCollapsed:!1,aggregateChildGroups:!1,collapsed:!1,displayTotalsRow:!0,lazyTotalsCalculation:!1},Rt=[],St=[],Mt=[],bt=":|:",Ft=0,Nt=0,At=0,Gt=new Slick.Event,Tt=new Slick.Event,Et=new Slick.Event;e=t.extend(!0,{},gt,e),t.extend(this,{beginUpdate:n,endUpdate:i,setPagingOptions:g,getPagingInfo:c,getItems:s,setItems:u,setFilter:d,sort:f,fastSort:p,reSort:h,setGrouping:v,getGrouping:m,groupBy:_,setAggregators:w,collapseAllGroups:k,expandAllGroups:j,collapseGroup:P,expandGroup:z,getGroups:B,getIdxById:y,getRowById:C,getItemById:I,getItemByIdx:$,mapRowsToIds:S,mapIdsToRows:R,setRefreshHints:r,setFilterArgs:o,refresh:et,updateItem:M,insertItem:b,addItem:F,deleteItem:N,syncGridSelection:nt,syncGridCellCssStyles:it,getLength:A,getItem:G,getItemMetadata:T,onRowCountChanged:Gt,onRowsChanged:Tt,onPagingInfoChanged:Et})}function n(t){this.field_=t,this.init=function(){this.count_=0,this.nonNullCount_=0,this.sum_=0},this.accumulate=function(t){var e=t[this.field_];this.count_++,null!=e&&""!==e&&NaN!==e&&(this.nonNullCount_++,this.sum_+=parseFloat(e))},this.storeResult=function(t){t.avg||(t.avg={}),0!=this.nonNullCount_&&(t.avg[this.field_]=this.sum_/this.nonNullCount_)}}function i(t){this.field_=t,this.init=function(){this.min_=null},this.accumulate=function(t){var e=t[this.field_];null!=e&&""!==e&&NaN!==e&&(null==this.min_||e<this.min_)&&(this.min_=e)},this.storeResult=function(t){t.min||(t.min={}),t.min[this.field_]=this.min_}}function r(t){this.field_=t,this.init=function(){this.max_=null},this.accumulate=function(t){var e=t[this.field_];null!=e&&""!==e&&NaN!==e&&(null==this.max_||e>this.max_)&&(this.max_=e)},this.storeResult=function(t){t.max||(t.max={}),t.max[this.field_]=this.max_}}function o(t){this.field_=t,this.init=function(){this.sum_=null},this.accumulate=function(t){var e=t[this.field_];null!=e&&""!==e&&NaN!==e&&(this.sum_+=parseFloat(e))},this.storeResult=function(t){t.sum||(t.sum={}),t.sum[this.field_]=this.sum_}}t.extend(!0,window,{Slick:{Data:{DataView:e,Aggregators:{Avg:n,Min:i,Max:r,Sum:o}}}})}(jQuery);
(function ($) {
  $.extend(true, window, {
    Slick: {
      Data: {
        DataView: DataView,
        Aggregators: {
          Avg: AvgAggregator,
          Min: MinAggregator,
          Max: MaxAggregator,
          Sum: SumAggregator
        }
      }
    }
  });


  /***
   * A sample Model implementation.
   * Provides a filtered view of the underlying data.
   *
   * Relies on the data item having an "id" property uniquely identifying it.
   */
  function DataView(options) {
    var self = this;

    var defaults = {
      groupItemMetadataProvider: null,
      inlineFilters: false
    };


    // private
    var idProperty = "id";  // property holding a unique row id
    var items = [];         // data by index
    var rows = [];          // data by row
    var idxById = {};       // indexes by id
    var rowsById = null;    // rows by id; lazy-calculated
    var filter = null;      // filter function
    var updated = null;     // updated item ids
    var suspend = false;    // suspends the recalculation
    var sortAsc = true;
    var fastSortField;
    var sortComparer;
    var refreshHints = {};
    var prevRefreshHints = {};
    var filterArgs;
    var filteredItems = [];
    var compiledFilter;
    var compiledFilterWithCaching;
    var filterCache = [];

    // grouping
    var groupingInfoDefaults = {
      getter: null,
      formatter: null,
      comparer: function(a, b) { return a.value - b.value; },
      predefinedValues: [],
      aggregators: [],
      aggregateEmpty: false,
      aggregateCollapsed: false,
      aggregateChildGroups: false,
      collapsed: false,
      displayTotalsRow: true,
      lazyTotalsCalculation: false
    };
    var groupingInfos = [];
    var groups = [];
    var toggledGroupsByLevel = [];
    var groupingDelimiter = ':|:';

    var pagesize = 0;
    var pagenum = 0;
    var totalRows = 0;

    // events
    var onRowCountChanged = new Slick.Event();
    var onRowsChanged = new Slick.Event();
    var onPagingInfoChanged = new Slick.Event();

    options = $.extend(true, {}, defaults, options);


    function beginUpdate() {
      suspend = true;
    }

    function endUpdate() {
      suspend = false;
      refresh();
    }

    function setRefreshHints(hints) {
      refreshHints = hints;
    }

    function setFilterArgs(args) {
      filterArgs = args;
    }

    function updateIdxById(startingIndex) {
      startingIndex = startingIndex || 0;
      var id;
      for (var i = startingIndex, l = items.length; i < l; i++) {
        id = items[i][idProperty];
        if (id === undefined) {
          throw "Each data element must implement a unique 'id' property";
        }
        idxById[id] = i;
      }
    }

    function ensureIdUniqueness() {
      var id;
      for (var i = 0, l = items.length; i < l; i++) {
        id = items[i][idProperty];
        if (id === undefined || idxById[id] !== i) {
          throw "Each data element must implement a unique 'id' property";
        }
      }
    }

    function getItems() {
      return items;
    }

    function setItems(data, objectIdProperty) {
      if (objectIdProperty !== undefined) {
        idProperty = objectIdProperty;
      }
      items = filteredItems = data;
      idxById = {};
      updateIdxById();
      ensureIdUniqueness();
      refresh();
    }

    function setPagingOptions(args) {
      if (args.pageSize != undefined) {
        pagesize = args.pageSize;
        pagenum = pagesize ? Math.min(pagenum, Math.max(0, Math.ceil(totalRows / pagesize) - 1)) : 0;
      }

      if (args.pageNum != undefined) {
        pagenum = Math.min(args.pageNum, Math.max(0, Math.ceil(totalRows / pagesize) - 1));
      }

      onPagingInfoChanged.notify(getPagingInfo(), null, self);

      refresh();
    }

    function getPagingInfo() {
      var totalPages = pagesize ? Math.max(1, Math.ceil(totalRows / pagesize)) : 1;
      return {pageSize: pagesize, pageNum: pagenum, totalRows: totalRows, totalPages: totalPages};
    }

    function sort(comparer, ascending) {
      sortAsc = ascending;
      sortComparer = comparer;
      fastSortField = null;
      if (ascending === false) {
        items.reverse();
      }
      items.sort(comparer);
      if (ascending === false) {
        items.reverse();
      }
      idxById = {};
      updateIdxById();
      refresh();
    }

    /***
     * Provides a workaround for the extremely slow sorting in IE.
     * Does a [lexicographic] sort on a give column by temporarily overriding Object.prototype.toString
     * to return the value of that field and then doing a native Array.sort().
     */
    function fastSort(field, ascending) {
      sortAsc = ascending;
      fastSortField = field;
      sortComparer = null;
      var oldToString = Object.prototype.toString;
      Object.prototype.toString = (typeof field == "function") ? field : function () {
        return this[field]
      };
      // an extra reversal for descending sort keeps the sort stable
      // (assuming a stable native sort implementation, which isn't true in some cases)
      if (ascending === false) {
        items.reverse();
      }
      items.sort();
      Object.prototype.toString = oldToString;
      if (ascending === false) {
        items.reverse();
      }
      idxById = {};
      updateIdxById();
      refresh();
    }

    function reSort() {
      if (sortComparer) {
        sort(sortComparer, sortAsc);
      } else if (fastSortField) {
        fastSort(fastSortField, sortAsc);
      }
    }

    function setFilter(filterFn) {
      filter = filterFn;
      if (options.inlineFilters) {
        compiledFilter = compileFilter();
        compiledFilterWithCaching = compileFilterWithCaching();
      }
      refresh();
    }

    function getGrouping() {
      return groupingInfos;
    }

    function setGrouping(groupingInfo) {
      if (!options.groupItemMetadataProvider) {
        options.groupItemMetadataProvider = new Slick.Data.GroupItemMetadataProvider();
      }

      groups = [];
      toggledGroupsByLevel = [];
      groupingInfo = groupingInfo || [];
      groupingInfos = (groupingInfo instanceof Array) ? groupingInfo : [groupingInfo];

      for (var i = 0; i < groupingInfos.length; i++) {
        var gi = groupingInfos[i] = $.extend(true, {}, groupingInfoDefaults, groupingInfos[i]);
        gi.getterIsAFn = typeof gi.getter === "function";

        // pre-compile accumulator loops
        gi.compiledAccumulators = [];
        var idx = gi.aggregators.length;
        while (idx--) {
          gi.compiledAccumulators[idx] = compileAccumulatorLoop(gi.aggregators[idx]);
        }

        toggledGroupsByLevel[i] = {};
      }

      refresh();
    }

    /**
     * @deprecated Please use {@link setGrouping}.
     */
    function groupBy(valueGetter, valueFormatter, sortComparer) {
      if (valueGetter == null) {
        setGrouping([]);
        return;
      }

      setGrouping({
        getter: valueGetter,
        formatter: valueFormatter,
        comparer: sortComparer
      });
    }

    /**
     * @deprecated Please use {@link setGrouping}.
     */
    function setAggregators(groupAggregators, includeCollapsed) {
      if (!groupingInfos.length) {
        throw new Error("At least one grouping must be specified before calling setAggregators().");
      }

      groupingInfos[0].aggregators = groupAggregators;
      groupingInfos[0].aggregateCollapsed = includeCollapsed;

      setGrouping(groupingInfos);
    }

    function getItemByIdx(i) {
      return items[i];
    }

    function getIdxById(id) {
      return idxById[id];
    }

    function ensureRowsByIdCache() {
      if (!rowsById) {
        rowsById = {};
        for (var i = 0, l = rows.length; i < l; i++) {
          rowsById[rows[i][idProperty]] = i;
        }
      }
    }

    function getRowById(id) {
      ensureRowsByIdCache();
      return rowsById[id];
    }

    function getItemById(id) {
      return items[idxById[id]];
    }

    function mapIdsToRows(idArray) {
      var rows = [];
      ensureRowsByIdCache();
      for (var i = 0, l = idArray.length; i < l; i++) {
        var row = rowsById[idArray[i]];
        if (row != null) {
          rows[rows.length] = row;
        }
      }
      return rows;
    }

    function mapRowsToIds(rowArray) {
      var ids = [];
      for (var i = 0, l = rowArray.length; i < l; i++) {
        if (rowArray[i] < rows.length) {
          ids[ids.length] = rows[rowArray[i]][idProperty];
        }
      }
      return ids;
    }

    function updateItem(id, item) {
      if (idxById[id] === undefined || id !== item[idProperty]) {
        throw "Invalid or non-matching id";
      }
      items[idxById[id]] = item;
      if (!updated) {
        updated = {};
      }
      updated[id] = true;
      refresh();
    }

    function insertItem(insertBefore, item) {
      items.splice(insertBefore, 0, item);
      updateIdxById(insertBefore);
      refresh();
    }

    function addItem(item) {
      items.push(item);
      updateIdxById(items.length - 1);
      refresh();
    }

    function deleteItem(id) {
      var idx = idxById[id];
      if (idx === undefined) {
        throw "Invalid id";
      }
      delete idxById[id];
      items.splice(idx, 1);
      updateIdxById(idx);
      refresh();
    }

    function getLength() {
      return rows.length;
    }

    function getItem(i) {
      var item = rows[i];

      // if this is a group row, make sure totals are calculated and update the title
      if (item && item.__group && item.totals && !item.totals.initialized) {
        var gi = groupingInfos[item.level];
        if (!gi.displayTotalsRow) {
          calculateTotals(item.totals);
          item.title = gi.formatter ? gi.formatter(item) : item.value;
        }
      }
      // if this is a totals row, make sure it's calculated
      else if (item && item.__groupTotals && !item.initialized) {
        calculateTotals(item);
      }

      return item;
    }

    function getItemMetadata(i) {
      var item = rows[i];
      if (item === undefined) {
        return null;
      }

      // overrides for grouping rows
      if (item.__group) {
        return options.groupItemMetadataProvider.getGroupRowMetadata(item);
      }

      // overrides for totals rows
      if (item.__groupTotals) {
        return options.groupItemMetadataProvider.getTotalsRowMetadata(item);
      }

      return null;
    }

    function expandCollapseAllGroups(level, collapse) {
      if (level == null) {
        for (var i = 0; i < groupingInfos.length; i++) {
          toggledGroupsByLevel[i] = {};
          groupingInfos[i].collapsed = collapse;
        }
      } else {
        toggledGroupsByLevel[level] = {};
        groupingInfos[level].collapsed = collapse;
      }
      refresh();
    }

    /**
     * @param level {Number} Optional level to collapse.  If not specified, applies to all levels.
     */
    function collapseAllGroups(level) {
      expandCollapseAllGroups(level, true);
    }

    /**
     * @param level {Number} Optional level to expand.  If not specified, applies to all levels.
     */
    function expandAllGroups(level) {
      expandCollapseAllGroups(level, false);
    }

    function expandCollapseGroup(level, groupingKey, collapse) {
      toggledGroupsByLevel[level][groupingKey] = groupingInfos[level].collapsed ^ collapse;
      refresh();
    }

    /**
     * @param varArgs Either a Slick.Group's "groupingKey" property, or a
     *     variable argument list of grouping values denoting a unique path to the row.  For
     *     example, calling collapseGroup('high', '10%') will collapse the '10%' subgroup of
     *     the 'high' group.
     */
    function collapseGroup(varArgs) {
      var args = Array.prototype.slice.call(arguments);
      var arg0 = args[0];
      if (args.length == 1 && arg0.indexOf(groupingDelimiter) != -1) {
        expandCollapseGroup(arg0.split(groupingDelimiter).length - 1, arg0, true);
      } else {
        expandCollapseGroup(args.length - 1, args.join(groupingDelimiter), true);
      }
    }

    /**
     * @param varArgs Either a Slick.Group's "groupingKey" property, or a
     *     variable argument list of grouping values denoting a unique path to the row.  For
     *     example, calling expandGroup('high', '10%') will expand the '10%' subgroup of
     *     the 'high' group.
     */
    function expandGroup(varArgs) {
      var args = Array.prototype.slice.call(arguments);
      var arg0 = args[0];
      if (args.length == 1 && arg0.indexOf(groupingDelimiter) != -1) {
        expandCollapseGroup(arg0.split(groupingDelimiter).length - 1, arg0, false);
      } else {
        expandCollapseGroup(args.length - 1, args.join(groupingDelimiter), false);
      }
    }

    function getGroups() {
      return groups;
    }

    function extractGroups(rows, parentGroup) {
      var group;
      var val;
      var groups = [];
      var groupsByVal = {};
      var r;
      var level = parentGroup ? parentGroup.level + 1 : 0;
      var gi = groupingInfos[level];

      for (var i = 0, l = gi.predefinedValues.length; i < l; i++) {
        val = gi.predefinedValues[i];
        group = groupsByVal[val];
        if (!group) {
          group = new Slick.Group();
          group.value = val;
          group.level = level;
          group.groupingKey = (parentGroup ? parentGroup.groupingKey + groupingDelimiter : '') + val;
          groups[groups.length] = group;
          groupsByVal[val] = group;
        }
      }

      for (var i = 0, l = rows.length; i < l; i++) {
        r = rows[i];
        val = gi.getterIsAFn ? gi.getter(r) : r[gi.getter];
        group = groupsByVal[val];
        if (!group) {
          group = new Slick.Group();
          group.value = val;
          group.level = level;
          group.groupingKey = (parentGroup ? parentGroup.groupingKey + groupingDelimiter : '') + val;
          groups[groups.length] = group;
          groupsByVal[val] = group;
        }

        group.rows[group.count++] = r;
      }

      if (level < groupingInfos.length - 1) {
        for (var i = 0; i < groups.length; i++) {
          group = groups[i];
          group.groups = extractGroups(group.rows, group);
        }
      }      

      groups.sort(groupingInfos[level].comparer);

      return groups;
    }

    function calculateTotals(totals) {
      var group = totals.group;
      var gi = groupingInfos[group.level];
      var isLeafLevel = (group.level == groupingInfos.length);
      var agg, idx = gi.aggregators.length;

      if (!isLeafLevel && gi.aggregateChildGroups) {
        // make sure all the subgroups are calculated
        var i = group.groups.length;
        while (i--) {
          if (!group.groups[i].initialized) {
            calculateTotals(group.groups[i]);
          }
        }
      }

      while (idx--) {
        agg = gi.aggregators[idx];
        agg.init();
        if (!isLeafLevel && gi.aggregateChildGroups) {
          gi.compiledAccumulators[idx].call(agg, group.groups);
        } else {
          gi.compiledAccumulators[idx].call(agg, group.rows);
        }
        agg.storeResult(totals);
      }
      totals.initialized = true;
    }

    function addGroupTotals(group) {
      var gi = groupingInfos[group.level];
      var totals = new Slick.GroupTotals();
      totals.group = group;
      group.totals = totals;
      if (!gi.lazyTotalsCalculation) {
        calculateTotals(totals);
      }
    }

    function addTotals(groups, level) {
      level = level || 0;
      var gi = groupingInfos[level];
      var groupCollapsed = gi.collapsed;
      var toggledGroups = toggledGroupsByLevel[level];      
      var idx = groups.length, g;
      while (idx--) {
        g = groups[idx];

        if (g.collapsed && !gi.aggregateCollapsed) {
          continue;
        }

        // Do a depth-first aggregation so that parent group aggregators can access subgroup totals.
        if (g.groups) {
          addTotals(g.groups, level + 1);
        }

        if (gi.aggregators.length && (
            gi.aggregateEmpty || g.rows.length || (g.groups && g.groups.length))) {
          addGroupTotals(g);
        }

        g.collapsed = groupCollapsed ^ toggledGroups[g.groupingKey];
        g.title = gi.formatter ? gi.formatter(g) : g.value;
      }
    } 

    function flattenGroupedRows(groups, level) {
      level = level || 0;
      var gi = groupingInfos[level];
      var groupedRows = [], rows, gl = 0, g;
      for (var i = 0, l = groups.length; i < l; i++) {
        g = groups[i];
        groupedRows[gl++] = g;

        if (!g.collapsed) {
          rows = g.groups ? flattenGroupedRows(g.groups, level + 1) : g.rows;
          for (var j = 0, jj = rows.length; j < jj; j++) {
            groupedRows[gl++] = rows[j];
          }
        }

        if (g.totals && gi.displayTotalsRow && (!g.collapsed || gi.aggregateCollapsed)) {
          groupedRows[gl++] = g.totals;
        }
      }
      return groupedRows;
    }

    function getFunctionInfo(fn) {
      var fnRegex = /^function[^(]*\(([^)]*)\)\s*{([\s\S]*)}$/;
      var matches = fn.toString().match(fnRegex);
      return {
        params: matches[1].split(","),
        body: matches[2]
      };
    }

    function compileAccumulatorLoop(aggregator) {
      var accumulatorInfo = getFunctionInfo(aggregator.accumulate);
      var fn = new Function(
          "_items",
          "for (var " + accumulatorInfo.params[0] + ", _i=0, _il=_items.length; _i<_il; _i++) {" +
              accumulatorInfo.params[0] + " = _items[_i]; " +
              accumulatorInfo.body +
          "}"
      );
      fn.displayName = fn.name = "compiledAccumulatorLoop";
      return fn;
    }

    function compileFilter() {
      var filterInfo = getFunctionInfo(filter);

      var filterBody = filterInfo.body
          .replace(/return false\s*([;}]|$)/gi, "{ continue _coreloop; }$1")
          .replace(/return true\s*([;}]|$)/gi, "{ _retval[_idx++] = $item$; continue _coreloop; }$1")
          .replace(/return ([^;}]+?)\s*([;}]|$)/gi,
          "{ if ($1) { _retval[_idx++] = $item$; }; continue _coreloop; }$2");

      // This preserves the function template code after JS compression,
      // so that replace() commands still work as expected.
      var tpl = [
        //"function(_items, _args) { ",
        "var _retval = [], _idx = 0; ",
        "var $item$, $args$ = _args; ",
        "_coreloop: ",
        "for (var _i = 0, _il = _items.length; _i < _il; _i++) { ",
        "$item$ = _items[_i]; ",
        "$filter$; ",
        "} ",
        "return _retval; "
        //"}"
      ].join("");
      tpl = tpl.replace(/\$filter\$/gi, filterBody);
      tpl = tpl.replace(/\$item\$/gi, filterInfo.params[0]);
      tpl = tpl.replace(/\$args\$/gi, filterInfo.params[1]);

      var fn = new Function("_items,_args", tpl);
      fn.displayName = fn.name = "compiledFilter";
      return fn;
    }

    function compileFilterWithCaching() {
      var filterInfo = getFunctionInfo(filter);

      var filterBody = filterInfo.body
          .replace(/return false\s*([;}]|$)/gi, "{ continue _coreloop; }$1")
          .replace(/return true\s*([;}]|$)/gi, "{ _cache[_i] = true;_retval[_idx++] = $item$; continue _coreloop; }$1")
          .replace(/return ([^;}]+?)\s*([;}]|$)/gi,
          "{ if ((_cache[_i] = $1)) { _retval[_idx++] = $item$; }; continue _coreloop; }$2");

      // This preserves the function template code after JS compression,
      // so that replace() commands still work as expected.
      var tpl = [
        //"function(_items, _args, _cache) { ",
        "var _retval = [], _idx = 0; ",
        "var $item$, $args$ = _args; ",
        "_coreloop: ",
        "for (var _i = 0, _il = _items.length; _i < _il; _i++) { ",
        "$item$ = _items[_i]; ",
        "if (_cache[_i]) { ",
        "_retval[_idx++] = $item$; ",
        "continue _coreloop; ",
        "} ",
        "$filter$; ",
        "} ",
        "return _retval; "
        //"}"
      ].join("");
      tpl = tpl.replace(/\$filter\$/gi, filterBody);
      tpl = tpl.replace(/\$item\$/gi, filterInfo.params[0]);
      tpl = tpl.replace(/\$args\$/gi, filterInfo.params[1]);

      var fn = new Function("_items,_args,_cache", tpl);
      fn.displayName = fn.name = "compiledFilterWithCaching";
      return fn;
    }

    function uncompiledFilter(items, args) {
      var retval = [], idx = 0;

      for (var i = 0, ii = items.length; i < ii; i++) {
        if (filter(items[i], args)) {
          retval[idx++] = items[i];
        }
      }

      return retval;
    }

    function uncompiledFilterWithCaching(items, args, cache) {
      var retval = [], idx = 0, item;

      for (var i = 0, ii = items.length; i < ii; i++) {
        item = items[i];
        if (cache[i]) {
          retval[idx++] = item;
        } else if (filter(item, args)) {
          retval[idx++] = item;
          cache[i] = true;
        }
      }

      return retval;
    }

    function getFilteredAndPagedItems(items) {
      if (filter) {
        var batchFilter = options.inlineFilters ? compiledFilter : uncompiledFilter;
        var batchFilterWithCaching = options.inlineFilters ? compiledFilterWithCaching : uncompiledFilterWithCaching;

        if (refreshHints.isFilterNarrowing) {
          filteredItems = batchFilter(filteredItems, filterArgs);
        } else if (refreshHints.isFilterExpanding) {
          filteredItems = batchFilterWithCaching(items, filterArgs, filterCache);
        } else if (!refreshHints.isFilterUnchanged) {
          filteredItems = batchFilter(items, filterArgs);
        }
      } else {
        // special case:  if not filtering and not paging, the resulting
        // rows collection needs to be a copy so that changes due to sort
        // can be caught
        filteredItems = pagesize ? items : items.concat();
      }

      // get the current page
      var paged;
      if (pagesize) {
        if (filteredItems.length < pagenum * pagesize) {
          pagenum = Math.floor(filteredItems.length / pagesize);
        }
        paged = filteredItems.slice(pagesize * pagenum, pagesize * pagenum + pagesize);
      } else {
        paged = filteredItems;
      }

      return {totalRows: filteredItems.length, rows: paged};
    }

    function getRowDiffs(rows, newRows) {
      var item, r, eitherIsNonData, diff = [];
      var from = 0, to = newRows.length;

      if (refreshHints && refreshHints.ignoreDiffsBefore) {
        from = Math.max(0,
            Math.min(newRows.length, refreshHints.ignoreDiffsBefore));
      }

      if (refreshHints && refreshHints.ignoreDiffsAfter) {
        to = Math.min(newRows.length,
            Math.max(0, refreshHints.ignoreDiffsAfter));
      }

      for (var i = from, rl = rows.length; i < to; i++) {
        if (i >= rl) {
          diff[diff.length] = i;
        } else {
          item = newRows[i];
          r = rows[i];

          if ((groupingInfos.length && (eitherIsNonData = (item.__nonDataRow) || (r.__nonDataRow)) &&
              item.__group !== r.__group ||
              item.__group && !item.equals(r))
              || (eitherIsNonData &&
              // no good way to compare totals since they are arbitrary DTOs
              // deep object comparison is pretty expensive
              // always considering them 'dirty' seems easier for the time being
              (item.__groupTotals || r.__groupTotals))
              || item[idProperty] != r[idProperty]
              || (updated && updated[item[idProperty]])
              ) {
            diff[diff.length] = i;
          }
        }
      }
      return diff;
    }

    function recalc(_items) {
      rowsById = null;

      if (refreshHints.isFilterNarrowing != prevRefreshHints.isFilterNarrowing ||
          refreshHints.isFilterExpanding != prevRefreshHints.isFilterExpanding) {
        filterCache = [];
      }

      var filteredItems = getFilteredAndPagedItems(_items);
      totalRows = filteredItems.totalRows;
      var newRows = filteredItems.rows;

      groups = [];
      if (groupingInfos.length) {
        groups = extractGroups(newRows);
        if (groups.length) {
          addTotals(groups);
          newRows = flattenGroupedRows(groups);
        }
      }

      var diff = getRowDiffs(rows, newRows);

      rows = newRows;

      return diff;
    }

    function refresh() {
      if (suspend) {
        return;
      }

      var countBefore = rows.length;
      var totalRowsBefore = totalRows;

      var diff = recalc(items, filter); // pass as direct refs to avoid closure perf hit

      // if the current page is no longer valid, go to last page and recalc
      // we suffer a performance penalty here, but the main loop (recalc) remains highly optimized
      if (pagesize && totalRows < pagenum * pagesize) {
        pagenum = Math.max(0, Math.ceil(totalRows / pagesize) - 1);
        diff = recalc(items, filter);
      }

      updated = null;
      prevRefreshHints = refreshHints;
      refreshHints = {};

      if (totalRowsBefore != totalRows) {
        onPagingInfoChanged.notify(getPagingInfo(), null, self);
      }
      if (countBefore != rows.length) {
        onRowCountChanged.notify({previous: countBefore, current: rows.length}, null, self);
      }
      if (diff.length > 0) {
        onRowsChanged.notify({rows: diff}, null, self);
      }
    }

    /***
     * Wires the grid and the DataView together to keep row selection tied to item ids.
     * This is useful since, without it, the grid only knows about rows, so if the items
     * move around, the same rows stay selected instead of the selection moving along
     * with the items.
     *
     * NOTE:  This doesn't work with cell selection model.
     *
     * @param grid {Slick.Grid} The grid to sync selection with.
     * @param preserveHidden {Boolean} Whether to keep selected items that go out of the
     *     view due to them getting filtered out.
     * @param preserveHiddenOnSelectionChange {Boolean} Whether to keep selected items
     *     that are currently out of the view (see preserveHidden) as selected when selection
     *     changes.
     * @return {Slick.Event} An event that notifies when an internal list of selected row ids
     *     changes.  This is useful since, in combination with the above two options, it allows
     *     access to the full list selected row ids, and not just the ones visible to the grid.
     * @method syncGridSelection
     */
    function syncGridSelection(grid, preserveHidden, preserveHiddenOnSelectionChange) {
      var self = this;
      var inHandler;
      var selectedRowIds = self.mapRowsToIds(grid.getSelectedRows());
      var onSelectedRowIdsChanged = new Slick.Event();

      function setSelectedRowIds(rowIds) {
        if (selectedRowIds.join(",") == rowIds.join(",")) {
          return;
        }

        selectedRowIds = rowIds;

        onSelectedRowIdsChanged.notify({
          "grid": grid,
          "ids": selectedRowIds
        }, new Slick.EventData(), self);
      }

      function update() {
        if (selectedRowIds.length > 0) {
          inHandler = true;
          var selectedRows = self.mapIdsToRows(selectedRowIds);
          if (!preserveHidden) {
            setSelectedRowIds(self.mapRowsToIds(selectedRows));       
          }
          grid.setSelectedRows(selectedRows);
          inHandler = false;
        }
      }

      grid.onSelectedRowsChanged.subscribe(function(e, args) {
        if (inHandler) { return; }
        var newSelectedRowIds = self.mapRowsToIds(grid.getSelectedRows());
        if (!preserveHiddenOnSelectionChange || !grid.getOptions().multiSelect) {
          setSelectedRowIds(newSelectedRowIds);
        } else {
          // keep the ones that are hidden
          var existing = $.grep(selectedRowIds, function(id) { return self.getRowById(id) === undefined; });
          // add the newly selected ones
          setSelectedRowIds(existing.concat(newSelectedRowIds));
        }
      });

      this.onRowsChanged.subscribe(update);

      this.onRowCountChanged.subscribe(update);

      return onSelectedRowIdsChanged;
    }

    function syncGridCellCssStyles(grid, key) {
      var hashById;
      var inHandler;

      // since this method can be called after the cell styles have been set,
      // get the existing ones right away
      storeCellCssStyles(grid.getCellCssStyles(key));

      function storeCellCssStyles(hash) {
        hashById = {};
        for (var row in hash) {
          var id = rows[row][idProperty];
          hashById[id] = hash[row];
        }
      }

      function update() {
        if (hashById) {
          inHandler = true;
          ensureRowsByIdCache();
          var newHash = {};
          for (var id in hashById) {
            var row = rowsById[id];
            if (row != undefined) {
              newHash[row] = hashById[id];
            }
          }
          grid.setCellCssStyles(key, newHash);
          inHandler = false;
        }
      }

      grid.onCellCssStylesChanged.subscribe(function(e, args) {
        if (inHandler) { return; }
        if (key != args.key) { return; }
        if (args.hash) {
          storeCellCssStyles(args.hash);
        }
      });

      this.onRowsChanged.subscribe(update);

      this.onRowCountChanged.subscribe(update);
    }

    $.extend(this, {
      // methods
      "beginUpdate": beginUpdate,
      "endUpdate": endUpdate,
      "setPagingOptions": setPagingOptions,
      "getPagingInfo": getPagingInfo,
      "getItems": getItems,
      "setItems": setItems,
      "setFilter": setFilter,
      "sort": sort,
      "fastSort": fastSort,
      "reSort": reSort,
      "setGrouping": setGrouping,
      "getGrouping": getGrouping,
      "groupBy": groupBy,
      "setAggregators": setAggregators,
      "collapseAllGroups": collapseAllGroups,
      "expandAllGroups": expandAllGroups,
      "collapseGroup": collapseGroup,
      "expandGroup": expandGroup,
      "getGroups": getGroups,
      "getIdxById": getIdxById,
      "getRowById": getRowById,
      "getItemById": getItemById,
      "getItemByIdx": getItemByIdx,
      "mapRowsToIds": mapRowsToIds,
      "mapIdsToRows": mapIdsToRows,
      "setRefreshHints": setRefreshHints,
      "setFilterArgs": setFilterArgs,
      "refresh": refresh,
      "updateItem": updateItem,
      "insertItem": insertItem,
      "addItem": addItem,
      "deleteItem": deleteItem,
      "syncGridSelection": syncGridSelection,
      "syncGridCellCssStyles": syncGridCellCssStyles,

      // data provider methods
      "getLength": getLength,
      "getItem": getItem,
      "getItemMetadata": getItemMetadata,

      // events
      "onRowCountChanged": onRowCountChanged,
      "onRowsChanged": onRowsChanged,
      "onPagingInfoChanged": onPagingInfoChanged
    });
  }

  function AvgAggregator(field) {
    this.field_ = field;

    this.init = function () {
      this.count_ = 0;
      this.nonNullCount_ = 0;
      this.sum_ = 0;
    };

    this.accumulate = function (item) {
      var val = item[this.field_];
      this.count_++;
      if (val != null && val !== "" && val !== NaN) {
        this.nonNullCount_++;
        this.sum_ += parseFloat(val);
      }
    };

    this.storeResult = function (groupTotals) {
      if (!groupTotals.avg) {
        groupTotals.avg = {};
      }
      if (this.nonNullCount_ != 0) {
        groupTotals.avg[this.field_] = this.sum_ / this.nonNullCount_;
      }
    };
  }

  function MinAggregator(field) {
    this.field_ = field;

    this.init = function () {
      this.min_ = null;
    };

    this.accumulate = function (item) {
      var val = item[this.field_];
      if (val != null && val !== "" && val !== NaN) {
        if (this.min_ == null || val < this.min_) {
          this.min_ = val;
        }
      }
    };

    this.storeResult = function (groupTotals) {
      if (!groupTotals.min) {
        groupTotals.min = {};
      }
      groupTotals.min[this.field_] = this.min_;
    }
  }

  function MaxAggregator(field) {
    this.field_ = field;

    this.init = function () {
      this.max_ = null;
    };

    this.accumulate = function (item) {
      var val = item[this.field_];
      if (val != null && val !== "" && val !== NaN) {
        if (this.max_ == null || val > this.max_) {
          this.max_ = val;
        }
      }
    };

    this.storeResult = function (groupTotals) {
      if (!groupTotals.max) {
        groupTotals.max = {};
      }
      groupTotals.max[this.field_] = this.max_;
    }
  }

  function SumAggregator(field) {
    this.field_ = field;

    this.init = function () {
      this.sum_ = null;
    };

    this.accumulate = function (item) {
      var val = item[this.field_];
      if (val != null && val !== "" && val !== NaN) {
        this.sum_ += parseFloat(val);
      }
    };

    this.storeResult = function (groupTotals) {
      if (!groupTotals.sum) {
        groupTotals.sum = {};
      }
      groupTotals.sum[this.field_] = this.sum_;
    }
  }

  // TODO:  add more built-in aggregators
  // TODO:  merge common aggregators in one to prevent needles iterating

})(jQuery);
(function ($) {
  // register namespace
  $.extend(true, window, {
    "Slick": {
      "CellRangeDecorator": CellRangeDecorator
    }
  });

  /***
   * Displays an overlay on top of a given cell range.
   *
   * TODO:
   * Currently, it blocks mouse events to DOM nodes behind it.
   * Use FF and WebKit-specific "pointer-events" CSS style, or some kind of event forwarding.
   * Could also construct the borders separately using 4 individual DIVs.
   *
   * @param {Grid} grid
   * @param {Object} options
   */
  function CellRangeDecorator(grid, options) {
    var _elem;
    var _defaults = {
      selectionCssClass: 'slick-range-decorator',
      selectionCss: {
        "zIndex": "9999",
        "border": "2px dashed red"
      }
    };

    options = $.extend(true, {}, _defaults, options);


    function show(range) {
      if (!_elem) {
        _elem = $("<div></div>", {css: options.selectionCss})
            .addClass(options.selectionCssClass)
            .css("position", "absolute")
            .appendTo(grid.getCanvasNode());
      }

      var from = grid.getCellNodeBox(range.fromRow, range.fromCell);
      var to = grid.getCellNodeBox(range.toRow, range.toCell);

      _elem.css({
        top: from.top - 1,
        left: from.left - 1,
        height: to.bottom - from.top - 2,
        width: to.right - from.left - 2
      });

      return _elem;
    }

    function hide() {
      if (_elem) {
        _elem.remove();
        _elem = null;
      }
    }

    $.extend(this, {
      "show": show,
      "hide": hide
    });
  }
})(jQuery);
(function ($) {
  // register namespace
  $.extend(true, window, {
    "Slick": {
      "CellRangeSelector": CellRangeSelector
    }
  });


  function CellRangeSelector(options) {
    var _grid;
    var _canvas;
    var _dragging;
    var _decorator;
    var _self = this;
    var _handler = new Slick.EventHandler();
    var _defaults = {
      selectionCss: {
        "border": "2px dashed blue"
      }
    };


    function init(grid) {
      options = $.extend(true, {}, _defaults, options);
      _decorator = new Slick.CellRangeDecorator(grid, options);
      _grid = grid;
      _canvas = _grid.getCanvasNode();
      _handler
        .subscribe(_grid.onDragInit, handleDragInit)
        .subscribe(_grid.onDragStart, handleDragStart)
        .subscribe(_grid.onDrag, handleDrag)
        .subscribe(_grid.onDragEnd, handleDragEnd);
    }

    function destroy() {
      _handler.unsubscribeAll();
    }

    function handleDragInit(e, dd) {
      // prevent the grid from cancelling drag'n'drop by default
      e.stopImmediatePropagation();
    }

    function handleDragStart(e, dd) {
      var cell = _grid.getCellFromEvent(e);
      if (_self.onBeforeCellRangeSelected.notify(cell) !== false) {
        if (_grid.canCellBeSelected(cell.row, cell.cell)) {
          _dragging = true;
          e.stopImmediatePropagation();
        }
      }
      if (!_dragging) {
        return;
      }

      _grid.focus();

      var start = _grid.getCellFromPoint(
          dd.startX - $(_canvas).offset().left,
          dd.startY - $(_canvas).offset().top);

      dd.range = {start: start, end: {}};

      return _decorator.show(new Slick.Range(start.row, start.cell));
    }

    function handleDrag(e, dd) {
      if (!_dragging) {
        return;
      }
      e.stopImmediatePropagation();

      var end = _grid.getCellFromPoint(
          e.pageX - $(_canvas).offset().left,
          e.pageY - $(_canvas).offset().top);

      if (!_grid.canCellBeSelected(end.row, end.cell)) {
        return;
      }

      dd.range.end = end;
      _decorator.show(new Slick.Range(dd.range.start.row, dd.range.start.cell, end.row, end.cell));
    }

    function handleDragEnd(e, dd) {
      if (!_dragging) {
        return;
      }

      _dragging = false;
      e.stopImmediatePropagation();

      _decorator.hide();
      _self.onCellRangeSelected.notify({
        range: new Slick.Range(
            dd.range.start.row,
            dd.range.start.cell,
            dd.range.end.row,
            dd.range.end.cell
        )
      });
    }

    $.extend(this, {
      "init": init,
      "destroy": destroy,

      "onBeforeCellRangeSelected": new Slick.Event(),
      "onCellRangeSelected": new Slick.Event()
    });
  }
})(jQuery);


(function ($) {
  // register namespace
  $.extend(true, window, {
    "Slick": {
      "CellSelectionModel": CellSelectionModel
    }
  });


  function CellSelectionModel(options) {
    var _grid;
    var _canvas;
    var _ranges = [];
    var _self = this;
    var _selector = new Slick.CellRangeSelector({
      "selectionCss": {
        "border": "2px solid black"
      }
    });
    var _options;
    var _defaults = {
      selectActiveCell: true
    };


    function init(grid) {
      _options = $.extend(true, {}, _defaults, options);
      _grid = grid;
      _canvas = _grid.getCanvasNode();
      _grid.onActiveCellChanged.subscribe(handleActiveCellChange);
      _grid.onKeyDown.subscribe(handleKeyDown);
      grid.registerPlugin(_selector);
      _selector.onCellRangeSelected.subscribe(handleCellRangeSelected);
      _selector.onBeforeCellRangeSelected.subscribe(handleBeforeCellRangeSelected);
    }

    function destroy() {
      _grid.onActiveCellChanged.unsubscribe(handleActiveCellChange);
      _grid.onKeyDown.unsubscribe(handleKeyDown);
      _selector.onCellRangeSelected.unsubscribe(handleCellRangeSelected);
      _selector.onBeforeCellRangeSelected.unsubscribe(handleBeforeCellRangeSelected);
      _grid.unregisterPlugin(_selector);
    }

    function removeInvalidRanges(ranges) {
      var result = [];

      for (var i = 0; i < ranges.length; i++) {
        var r = ranges[i];
        if (_grid.canCellBeSelected(r.fromRow, r.fromCell) && _grid.canCellBeSelected(r.toRow, r.toCell)) {
          result.push(r);
        }
      }

      return result;
    }

    function setSelectedRanges(ranges) {
      _ranges = removeInvalidRanges(ranges);
      _self.onSelectedRangesChanged.notify(_ranges);
    }

    function getSelectedRanges() {
      return _ranges;
    }

    function handleBeforeCellRangeSelected(e, args) {
      if (_grid.getEditorLock().isActive()) {
        e.stopPropagation();
        return false;
      }
    }

    function handleCellRangeSelected(e, args) {
      setSelectedRanges([args.range]);
    }

    function handleActiveCellChange(e, args) {
      if (_options.selectActiveCell && args.row != null && args.cell != null) {
        setSelectedRanges([new Slick.Range(args.row, args.cell)]);
      }
    }
    
    function handleKeyDown(e) {
      /***
       * Кey codes
       * 37 left
       * 38 up
       * 39 right
       * 40 down                     
       */                                         
      var ranges, last;
      var active = _grid.getActiveCell(); 

      if ( active && e.shiftKey && !e.ctrlKey && !e.altKey && 
          (e.which == 37 || e.which == 39 || e.which == 38 || e.which == 40) ) {
      
        ranges = getSelectedRanges();
        if (!ranges.length)
         ranges.push(new Slick.Range(active.row, active.cell));
         
        // keyboard can work with last range only          
        last = ranges.pop();
        
        // can't handle selection out of active cell
        if (!last.contains(active.row, active.cell))
          last = new Slick.Range(active.row, active.cell);
        
        var dRow = last.toRow - last.fromRow,
            dCell = last.toCell - last.fromCell,
            // walking direction
            dirRow = active.row == last.fromRow ? 1 : -1,
            dirCell = active.cell == last.fromCell ? 1 : -1;
                 
        if (e.which == 37) {
          dCell -= dirCell; 
        } else if (e.which == 39) {
          dCell += dirCell ; 
        } else if (e.which == 38) {
          dRow -= dirRow; 
        } else if (e.which == 40) {
          dRow += dirRow; 
        }
        
        // define new selection range 
        var new_last = new Slick.Range(active.row, active.cell, active.row + dirRow*dRow, active.cell + dirCell*dCell);
        if (removeInvalidRanges([new_last]).length) {
          ranges.push(new_last);
          var viewRow = dirRow > 0 ? new_last.toRow : new_last.fromRow;
          var viewCell = dirCell > 0 ? new_last.toCell : new_last.fromCell;
         _grid.scrollRowIntoView(viewRow);
         _grid.scrollCellIntoView(viewRow, viewCell);
        }
        else 
          ranges.push(last);

        setSelectedRanges(ranges);  
       
        e.preventDefault();
        e.stopPropagation();        
      }           
    }

    $.extend(this, {
      "getSelectedRanges": getSelectedRanges,
      "setSelectedRanges": setSelectedRanges,

      "init": init,
      "destroy": destroy,

      "onSelectedRangesChanged": new Slick.Event()
    });
  }
})(jQuery);
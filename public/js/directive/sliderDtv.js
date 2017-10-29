angular.module("Slider.Common")

.directive("slideArea", function() {
	return {
		restrict:'A',
		replace:true,
		transclude:true,
		template: "<div id='sliderArea'>"+
				  "<div id='button' ng-transclude></div>"+
				  "<div id='target'><img src='{{getUrl()}}'></div>"+
				  "</div>",
		controller: function($scope) {			
			slider = this;

			slider.init = function(el) {
				slider.setHeight(el, slider.getMaxHeight());
			};

			slider.setHeight = function(el, cssHeight) {
				el.find('img').attr('height', cssHeight);
			};

			slider.showMenu = function() {
				$scope.menuToggle = !$scope.menuToggle;					
				$scope.$apply();
			};

			slider.getMaxHeight = function() {
				var heightAdjustment = 45;
				//トグル状態が真でなければメニューバーがあるって意味だから高さを下げる
				if(!$scope.menuToggle) {
					heightAdjustment = 95; //メニューバー３０、上端　４０、下端　可変または０、上下余白 ２０
				}

				return Math.ceil( $(window).height() - heightAdjustment ) + "px";
			};
		},
		link:function(scope, iel, iAttr, slider) {
			
			slider.init(iel);
			//写真押下時にイベントバインディング
			iel.children("#target").on('click', function() {
				//メニューバーを制御する
				slider.showMenu();
				//イメージ高さを再調整する
				slider.setHeight(iel, slider.getMaxHeight());
			});

			scope.$watch('slideImgNo', function(){
				slider.setHeight(iel, slider.getMaxHeight());
			});
		}
	};
});

angular.module("Slider.Common")

.directive("dragContainer", function() {
	return {
		restrict:"A",
		replace:false,
		controller: function() {
			var dragC = this;

			dragC.init = function(el) {
				dragC.el = el;
			};

			dragC.handleDragStart = function(e) {
				if(e.originalEvent) {
					e = e.originalEvent;
				}

				e.dataTransfer.dropEffect = 'move';
				e.dataTransfer.effectAllowed = 'move';

				e.dataTransfer.setData("text", dragC.el.attr('id') );

				console.log("handleDragStart");
			};

			dragC.handleDragEnd = function(e) {
				if(e.originalEvent) {
					e = e.originalEvent;
				}

				e.dataTransfer.dropEffect = 'move';
				e.dataTransfer.effectAllowed = 'move';	
				console.log("handleDragEnd");				
			};
		},
		link : function(scope, tEl, tAttr, dragC) {
			dragC.init(tEl);

			tEl.on('dragstart', dragC.handleDragStart.bind(dragC) );
			tEl.on('dragend', dragC.handleDragEnd.bind(dragC) );

			tAttr.$set('draggable', true);
		}
	};
});

angular.module("Slider.Common")
.directive("dropContainer", function($parse) {
	return {
		restrict:"A",
		replace:false,
		controller: function() {
			var dropC = this;

			dropC.init = function(el,scope) {
				dropC.el = el;
				dropC.scope = scope;
			};
			dropC.handleDragOver = function(e) {
				 e.preventDefault();
				dropC.el.css({height:'2px',border:'1px solid green'});
			};

			dropC.handleDrop = function(e) {
				if(e.originalEvent) { 
					e = e.originalEvent;
				}
				 
		    var data = e.dataTransfer.getData("text");
		    dropC.el.append(document.getElementById(data));
    		dropC.el
    			.css({backgroundColor:''});
    			
    		dropC.el	
    			.children('#'+data)
    			.css({left:'0px',top:'0px'});

				console.log("handleDrop");
			};

		},
		link : function(scope, tEl, tAttr, dropC) {

			var bindTo = function(evt) {
				return function(e) {
					return scope.$apply( function(){
						return dropC['handle' + evt](e);
					} );
				};
			};
			// tEl.css({width:'300px', height:'200px',backgroundColor:'yellow'});
			var handleDragOver = bindTo('DragOver');
			var handleDrop = bindTo('Drop');

			dropC.init(tEl, scope);

			tEl.on('drop', handleDrop );
			tEl.on('dragover', handleDragOver );

			// $document.on('dragend', dragEnd);

		}
	};
});

angular.module("Slider.Common")

.directive("registerRemarks", function() {
	return {
		restrict:"A",
		scope: {
			img:'=',
			ix :'@',
			src:'@',
			save:'&',
			click:'&router'
		},
		transclude:true,
		replace:false,
		template:"<img id='image'>"+
				 "<div id='inputBar'><textarea rows=1 cols=60 ng-model='remarks' ng-bind='img.remark'/>"+
				 "<button id='saveButton'>SAVE</button></div>",
		controller:	function($scope, imgLayout) {
			var register = this;
			register.el_img = null;
			register.el_div = null;
			register.el_pos = null;

			register.init = function(index, el) {
				register.el_img = imgLayout.getElement(index);
				register.el_pos = imgLayout.getPos(index);
				register.el_div = el;
			};
			register.getWidth = function() {
				return register.el_img.size.width;
			};
			register.getImgNo = function() {
				return register.el_img.id;
			};
			register.getRect = function(index) {
				return register.el_pos;
			};
		},
		controllerAs:'register',
		link:function(scope, iel, iAttr, register) {
			register.init(scope.ix, iel);

			iel.children('#image')
				.attr({
					'width'	: register.getWidth(),
					'src'	: scope.src
				})		
				.on('click', function(){
					
					// scope.$apply(function(){
						scope.click({url:'/slider', id:register.getImgNo(), evt:event});	
					// });
					console.log("click test");
				});

			iel.find('#saveButton')
				.on('click', function(){
					scope.save({ix:scope.ix, img:scope.img, remark:scope.remarks});
					console.log("저장완료");
				});

			iel.find('textarea')
				.attr('cols', Math.floor(register.getWidth() / 10))
				.css({
					fontSize:'11pt'
				});

			iel.children('#inputBar')
				.css({
					position:'relative',
					top:'0px',
					fontSize:'0.8em',
					color:'white'
				});

			var pos = register.getRect();

			 iel.css({
			 	position:'absolute',
			 	left: pos.left + "px",
			 	top : pos.top + "px",
			 	border:'1px solid #EAEAEA'
			 });

		}
	};
});

// app.directive("showRegisterDiv", function(jsonRepo2){
// 	return {
// 		restrict:'E',
// 		require: '^reg-layout-div',
// 		transclude:true,
// 		replace:true,
// 		template: "<div ng-transclude></div>",		
// 		link: function(scope, iel, iAttr, regTextCtrl) {
// 			var img = regTextCtrl.getSelectedImage();
			
// 			iel.css({
// 				position:'absolute',
// 				top:img.height,
// 				fontSize:'0.8em',
// 				color:'white'
// 			});

// 			iel.children('textarea')
// 				.attr('cols', Math.floor(img.width / 11))
// 				.css('fontSize', '11pt');
								
// 		}
// 	};
// });

// //화면출력
// //레이아웃 랜덤
// app.directive("regLayoutDiv", function(){
// 	return {
// 		restrict:"E",
// 		replace:true,
// 		transclude:true,
// 		template:"<div ng-transclude></div>",
// 		controller:function($scope, imgLayout) {
// 			layout = this;

// 			layout.getSelectedImage = function() {
// 				return imgLayout.getElement($scope.$index).size;
// 			};

// 			layout.getRect = function(ix) {
// 				return imgLayout.getPos(ix);
// 			}
// 		},
// 		link: function(scope,iel,iAttr,controller) {
// 			//compile.post와 역활이 아직 이해 하지 못함.

// 			// scope.$watch('imgSize',  function(){
				
// 				var rect = controller.getRect(scope.$index);

// 				 iel.css({
// 				 	position:'absolute',
// 				 	left: rect.left + "px",
// 				 	top : rect.top + "px",
// 				 	border:'1px solid #EAEAEA'
// 				 });
// 			// });
// 		}
// 	};
// });
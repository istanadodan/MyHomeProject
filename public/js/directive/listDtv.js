//섬네일 화면출력
//레이아웃 랜덤
angular.module("Slider.Common")

.directive("imageLayoutDiv", function(){
	return {
		restrict:"A",
		replace:false,
		template:"<img id='pic' src='{{getUrl(img)}}' width='100%'/>"+
				 "<div id='caption' ng-show='capOnOff'></div>",

		controller: function($scope, imgLayout) {
			layout = this;
			layout.posSize = null;
			layout.el = null;

			layout.init = function(el) {

				var initCss = {
					position:'absolute',
					left:'0px',
					top:'0px',
					border:'1px solid #EAEAEA'
					};

				layout.el = el;
				layout.setCssAtElement(initCss);
			};
			layout.getImgHeight = function(ix) {
				return imgLayout.getElement(ix).rect.height;
			};
			layout.setCssAtElement = function(css) {
				layout.el.css(css);
			};

			layout.getPositionAndSizeFromLayout = function(ix) {
				//imgLayout.getPos()の出力　{left, top, width, height}
				layout.posSize = imgLayout.getPos(ix);
			};

			layout.getImgNo = function(ix) {
				//getElementの返却値={id, rect{col,row}, size{width,height}, pos{x,y}}
				return imgLayout.getElement(ix).id;
			};

			layout.setCaption = function(objId, css, html) {
				layout.el.children('#'+objId)
					.css(css)
					.html(html);
			};
		},
		link: function(scope,iel,iAttr,layout) {

			layout.init(iel);

			layout.getPositionAndSizeFromLayout(scope.$index);				
			layout.setCssAtElement(layout.posSize);

			var cssCaption ={
					position:'relative',
					top:'-20px', 
					left:'0px',
					fontSize:'0.5em',
					color:'white'};
			layout.setCaption('caption', cssCaption, scope.img.remark);

			iel.on('click', function(){
				scope.callRouter('/slider', layout.getImgNo(scope.$index));
				scope.$apply();
			});
		}
	};
});
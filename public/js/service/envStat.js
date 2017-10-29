angular.module("Slider.Common")

.service("envStat", function($rootScope) {
	//섬네일이미지 크기레벨 상,중,하
	// this.thumbImgSize;
	//캡션이 켜져 있는지 여부 온/오프
	// this.isCaptionOn;
	//현재처리중인 이미지순번
	// this.pImgNo;
	//현재보여지는 화면번호,1:리스트, 2:슬라이드, 3:등록
	// this.displayNo;
	this.state = {	imgSize:$rootScope.THUMB_SIZE.MIDDLE, 
					isCapOn:$rootScope.FLAG.OFF, 
					imgNo:0, 
					display:$rootScope.DISP.LIST 
				  };

	this.getState = function() {
		return this.state;
	};
	this.getThumbSize = function(key) {
		var found = null;
		angular.forEach($rootScope.THUMB_SIZE, function(el,ix) {
			if(el == key)
				found = el;
		});
		return found || el.value;
	};
	this.setImgSize = function(lvl) {
		this.state.imgSize = lvl;
	};
	this.setIsCapOn = function(onOff) {
		this.state.isCapOn = onOff;
	};
	this.setImgNo = function(no) {
		this.state.imgNo = no || 0;
	};
	this.setDisplay = function(no) {
		this.state.display = no;
	};
});
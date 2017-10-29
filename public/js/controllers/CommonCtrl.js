/**
 * Created by Michael on 2016-09-24.
 */
angular.module("Slider.Ctrl")

.controller("CommonCtrl", function($scope,$rootScope,$location,jsonRepo2,medi,Util,envStat){

	jsonRepo2.init();
	jsonRepo2.getDirList().then(function(dirList){
		$scope.jsonFolder = dirList;
	});	
	$scope.imgSizes = $rootScope.THUMB_SIZE;//["SMALL","MIDDLE","LARGE"];
	//이미지초기값 설정
	$scope.imgSize = envStat.getState().imgSize;
	//caption on/off
	$scope.capOnOff = envStat.getState().isCapOn;

	$scope.loc = {home:'/',list:'/list',slider:'/slider',register:'/register'};
	$scope.init = function() {
		$scope.LOGO_URL="/album/img/default.jpg";
		//리스트기능 등록
		regMedi();
		
		//初期写真フォルダを指定する		
		if( jsonRepo2.getDir() === null ) {
			$scope.folder = "161105-에비스 츠타야서점";
		} else {
			$scope.folder = jsonRepo2.getDir();	
		}
		jsonRepo2.setDir($scope.folder);
		
	};
	$scope.callRouter = function(url, imgNo, event) {
		envStat.setIsCapOn($scope.capOnOff);
		envStat.setDisplay(url);
		//jsonRepo2에 index갱신
		$scope.transfer(event);

	};
	//화면전이
	$scope.transfer = function(event) {
		//화면전이를 위해 이벤트 전달을 중지시킴.
		if(event)
			event.preventDefault();
		//현재 사용중인 앨범객체에 선택항목 저장. 앨범별로 저장.
		//jsonRepo2.setIndex(envStat.getState().imgNo);
		//앵귤러 객체통해, 화면전이.
		$location.path(envStat.getState().display);
	};
	//화면에서 기능 호출용
	$scope.doMedi = function(flag,param) {
		switch(flag) {
			case $rootScope.STATUS.SMALL:
				medi.doo("SMALL");
				break;
			case $rootScope.STATUS.BIG:
				medi.doo($rootScope.STATUS.BIG, param);
				break;
			case $rootScope.STATUS.SLIDE:
				medi.doo($rootScope.STATUS.SLIDE, param);
				break;
			case $rootScope.STATUS.FOLDER:
				medi.doo($rootScope.STATUS.FOLDER, param);
				break;
			case $rootScope.STATUS.LIST:
				medi.doo($rootScope.STATUS.LIST);
				break;					
		}
	};

	var regMedi = function() {

		medi.reg($rootScope.STATUS.FOLDER, (function(){
			return function(name){
				if( name == null )
					return;

				jsonRepo2.setDir(name);

			};
		})(this));
	};		
});

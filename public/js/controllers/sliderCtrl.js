
angular.module("Slider.Ctrl")

.controller("sliderCtrl",function($scope,$interval,$rootScope,$timeout,medi,jsonRepo2,envStat,Util){
	$scope.imgSizes = $rootScope.THUMB_SIZE;//["SMALL","MIDDLE","LARGE"];

	//이미지초기값 설정
	$scope.imgSize = envStat.getState().imgSize;
	//caption on/off
	$scope.capOnOff = envStat.getState().isCapOn;
	
	$scope.slideSpeeds = [{key:"3s",value:3},{key:"5s",value:5},{key:"7s",value:7}];
	$scope.slideSpeed = $scope.slideSpeeds[0];
	$scope.slideImgNo = 0;
	//slide타이머 변수
	var slidingTimer = null;
	// $scope.$watch('imgSize', function(){
		// envStat.setImgSize($scope.imgSize);
	// });
	$scope.$watch('slideSpeed', function(){
		if(slidingTimer!==null) {
			medi.doo($rootScope.STATUS.SLIDE, $rootScope.CONST.RESTART);
		}
	});
	$scope.init = function() {
		//LOC
		$scope.mLoc = envStat.getState().display;

		$scope.menuToggle = false;
		//슬라이드동작버튼 초기화
		$scope.LabelToggleMenu=$rootScope.CONST.HIDE;
		//슬라이드타이머 초기화
		$scope.stopInterval();
		//리스트기능 등록
		regMedi();
		//앨범을 얻는다.
		$scope.folder = jsonRepo2.getDir();
		//파일목록을 얻는다. null인 경우, []을 적용.
		$scope.picList = jsonRepo2.getFileList();	
		//最初スライドイメージをセットする
		medi.doo($rootScope.STATUS.BIG, jsonRepo2.getIndex()||0);
	};
	$scope.getUrl = function(o_url) {
		return Util.getUrl(o_url);
	};
	$scope.callRouter = function(url, imgNo, event) {
		envStat.setImgSize($scope.imgSize);
		envStat.setIsCapOn($scope.capOnOff);
		envStat.setImgNo(imgNo);
		envStat.setDisplay(url);
		//jsonRepo2에 index갱신
		$scope.transfer(event);
	};
	$scope.isImgSliding = function() {
		return slidingTimer!==null;
	};
	//선택 혹은 슬라이딩 이미지주소를 얻는다.
	$scope.getUrl = function(o_url) {
		if(o_url) {
			return Util.getUrl(o_url);
		} else {
			return Util.getUrl(jsonRepo2.getItem());	
		}
		
	};
	//슬라이드 버튼라벨 취득
	$scope.getActionLabel = function() {
		//슬라이드 변수가 존재하면 슬라이딩중을 의미.
		if( $scope.isImgSliding() )
			return $rootScope.CONST.STOP;
		else
			return $rootScope.CONST.START;
	};
	$scope.showMenu = function(){
		$scope.menuToggle = !$scope.menuToggle;
	};
	//섬네일 이미지 높이, 폭을 구한다.
	$scope.getHeight = function(){
		return (Number($scope.imgSize.replace("px",""))*0.66406 /5 ) + "px";
	};

	$scope.stopInterval = function() {
		if(slidingTimer && slidingTimer!==null) { 
			$interval.cancel(slidingTimer);
			slidingTimer=null;
			
			return true;
		}
		return false;
	};

	$scope.callback = function() {
		// $scope.bigImage = $scope.filteredList[$scope.slideImgNo];
		// $scope.message = $scope.bigImage.rem + "[" +$scope.filteredList.length+"]";
	};

	var regMedi = function() {
		
		medi.reg($rootScope.STATUS.BIG, (function(){
			return function(imgNo){
				$scope.slideImgNo = imgNo;
				jsonRepo2.setIndex(imgNo);				
			};
		})(this));

		medi.reg($rootScope.STATUS.SLIDE, (function(){
			return function(flag){
				
				switch(flag) {
					case $rootScope.CONST.STOP:
						 //슬라이드 중지버튼인 경우, 
						$scope.stopInterval();
						break;

					case $rootScope.CONST.START:
					 	//슬라이드 시작버튼인 경우, 
					 	//既存のものを一旦止める
					 	$scope.stopInterval();
						slidingTimer = $interval( 
							function(){					
								if(++$scope.slideImgNo >= $scope.picList.length)
									$scope.slideImgNo = 0;
								//앨범에 선택 항목을 등록한다.
								jsonRepo2.setIndex($scope.slideImgNo);
								//콜백; 예비
								$scope.callback($scope.slideImgNo);
							},
							$scope.slideSpeed.value * 1000);
						break;

					default:
						//재실행인 경우						
						medi.doo($rootScope.STATUS.SLIDE, $rootScope.CONST.START);
				}
			};
		})(this));
	
		medi.reg($rootScope.STATUS.FOLDER, (function(){
			return function(name){
				if( name == null )
					return;

				var promise = jsonRepo2.setDir(name);
				if ( promise === null )
				{
					$scope.picList = jsonRepo2.getFileList();	
				}
				else
				{
					promise.then(function(rst) {
						$scope.picList = jsonRepo2.getFileList();
					});
				}
			};
		})(this));
	};
});

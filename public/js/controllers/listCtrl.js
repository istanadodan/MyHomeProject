/**
 * Created by Michael on 2016-09-24.
 */
angular.module("Slider.Ctrl")

.controller("listCtrl",function($scope,$rootScope,medi,jsonRepo2,imgLayout,envStat,Util){


	//이미지초기값 설정
	$scope.imgSize = envStat.getState().imgSize;
	//caption on/off
	$scope.capOnOff = envStat.getState().isCapOn;		
	//현재위치를 지정
	$scope.mLoc = envStat.getState().display;

    //앨범을 얻는다.
	$scope.folder = jsonRepo2.getDir();
	//파일목록을 얻는다. 
	$scope.picList = jsonRepo2.getFileList();	
	//초기레이아웃을 만든다.
	$scope.getUrl = function(o_url) {
		return Util.getUrl(o_url);
	};

	//이미지크기가 변경되었을때 실행. 이미지초기값설정시에도 실행됨.
	$scope.$watch('imgSize', function(){
		medi.doo($rootScope.STATUS.LIST, $scope.folder);
		console.log("imgsize changed");
	});

	$scope.init = function() {

		regMedi();
		
		medi.doo($rootScope.STATUS.LIST, $scope.folder);
	};
	$scope.callRouter = function(url, imgNo, event) {
		jsonRepo2.setIndex(imgNo);

		envStat.setImgSize($scope.imgSize);
		envStat.setIsCapOn($scope.capOnOff);
		envStat.setImgNo(imgNo);
		envStat.setDisplay(url);
		//jsonRepo2에 index갱신
		$scope.transfer(event);
	};
	var regMedi = function() {

		medi.reg($rootScope.STATUS.FOLDER, (function(){
			return function(name){
				if( name === null ) {
					return;
				}

				jsonRepo2.setDir(name).then(function(res){
					$scope.picList = jsonRepo2.getFileList();	
					medi.doo($rootScope.STATUS.LIST);
				});
			};
		})(this));

		medi.reg($rootScope.STATUS.LIST, (function(){
			return function(){

				imgLayout.init();

				var base = Number( $scope.imgSize.replace("px","") );
				angular.forEach($scope.picList, function(el,ix) {
					var width = Math.floor( (Math.random() * base*3/5 + base*2/5) / 50) * 50 - 2,
					    height = Math.floor( width * el.height/el.width);
					//id, width, height, posX, posY, ani
					imgLayout.register(ix, width, height ,1, 1, false);
					//console.log('ix',ix);
				});
			};
		})(this));		
	};
});

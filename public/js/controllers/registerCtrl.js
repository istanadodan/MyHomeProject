/**
 * Created by Michael on 2016-09-24.
 */
 angular.module("Slider.Ctrl")

.controller("registerCtrl", function($scope, $rootScope, $timeout, medi, jsonRepo2, albumModel, imgLayout, envStat, Util) {
	//이미지초기값 설정
	$scope.imgSize = envStat.getState().imgSize;
	//caption on/off
	$scope.capOnOff = envStat.getState().isCapOn;

	//이미지크기가 변경되었을때 실행. 이미지초기값설정시에도 실행됨.
	$scope.$watch('imgSize', function(){
		medi.doo($rootScope.STATUS.LIST, $scope.folder);
	});
	
	$scope.init = function() {
		$scope.LabelToggleMenu=$rootScope.CONST.HIDE;

		//리스트기능 등록
		regMedi();
		//앨범을 얻는다.
		$scope.folder = jsonRepo2.getDir();
		//파일목록을 얻는다. null인 경우, []을 적용.
		$scope.picList = jsonRepo2.getFileList();
	};
	$scope.callRouter = function(url, imgNo, event) {
		envStat.setImgSize($scope.imgSize);
		envStat.setIsCapOn($scope.capOnOff);
		envStat.setImgNo(imgNo);
		envStat.setDisplay(url);
		//jsonRepo2에 index갱신
		$scope.transfer(event);
	};
	$scope.getUrl = function(o_url) {
		return Util.getUrl(o_url);
	};
	$scope.dbSave = function(ix, item, remarks) {
		if(!remarks) {
			alert('수정사항이 없습니다.');
			return;
		}
		var selectedAlbum = jsonRepo2._getAlbumSelected();
		item.remark = remarks;
		selectedAlbum.setIdSelected(ix);
		selectedAlbum.setItem(item);

		//DBを更新する
		var obj = { 
				query :
				 { 
					folder	: $scope.folder,
					name	: item.name
				 },
				data :
				 { $set :{remark : remarks } }
				};

		albumModel.writeOne(obj).then(function(res){
				alert('修正がデビにセーブされました');
				console.log(res);
		});
	};


	$scope.s = [];
	$scope.selectedItems = [];
	$scope.putList = function(model,index,$event) {
		$event.preventDefault();
		if (!$scope.s[index] || $scope.s[index]===false){
			$scope.selectedItems.push(model);
			$scope.s[index] = true;
		}else {
			var pos = $scope.selectedItems.indexOf(model);
			$scope.selectedItems.splice(pos, 1);
			$scope.s[index] = false;
		}
	};
	
	var regMedi = function() {

		medi.reg($rootScope.STATUS.FOLDER, (function(){
			return function(name){
				if( name === null )
					return;

				var promise = jsonRepo2.setDir(name);
				if ( promise === null )
				{
					$scope.picList = jsonRepo2.getFileList();	
				}
				else
				{
					promise.then(function(album) {
						jsonRepo2._getAlbumSelected().setUpdate(1);
						$scope.picList = jsonRepo2.getFileList();
					});
				}

			};
		})(this));

		medi.reg($rootScope.STATUS.LIST, (function(){
			return function(){

				$scope.getWidth = function(ix) {
					return imgLayout.getElement(ix).size.width;
				};
				$scope.getRect = function(ix) {
					//console.log("ix="+ix);
					return imgLayout.getElement(ix).size.width;
				};
				$scope.getImgNo = function(ix) {
					return imgLayout.getElement(ix).id;
				};

				imgLayout.init();

				var base = Number( $scope.imgSize.replace("px","") );
				angular.forEach($scope.picList, function(el,ix) {
					var width = Math.floor( base ) - 2,
					    height = Math.floor( width * el.height/el.width);
					//id, width, height, posX, posY, ani
					imgLayout.register(ix, width, height ,1, 1, false);
				});
			};
		})(this));

	};

});

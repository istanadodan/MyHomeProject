
angular.module("Slider.Common")

.service("$album", function(){

	var album = function() {
		this.list = [];		 //앨범의 이미지파일목록
		this.name = null; 	 //앨범명
		this.idSelected = 0; //선택항목

		this.setList = function(list) {
			this.list = list;
		};
		this.setName = function(name) {
			this.name = name;
		};
		this.getList = function() {
			return this.list;
		};
		this.getName = function() {
			return this.name;
		};
		this.setIdSelected = function(id) {
			this.idSelected = id;
		};
		this.getIdSelected = function() {
			return this.idSelected;
		};
		this.getItem = function() {
			return this.list[this.idSelected];
		};
		this.setItem = function(item) {
			this.list[this.idSelected].folder = item.folder;
			this.list[this.idSelected].dir = item.dir;
			this.list[this.idSelected].name = item.name;
			this.list[this.idSelected].width = item.width;
			this.list[this.idSelected].height = item.height;			
		};
	};

	service = this;

	service._nameList = [];
	service._currentAlbum = null;
	service.list = [];
	service._count = 0;
	
	return {
		create : function(){
			return new album();
		},
		makeNameList : function(name) {
			service._nameList.push(name);
		},
		getNameList : function() {
			return service._nameList;
		},
		setData : function(album) {
			service.list.push(album);
			service._count++;
		},
		getSize : function() {
			return service._count;
		},
		getData : function(name) {

			for(var i=0; i < service.count; i++) {
				//앨범목록에서 순차적으로 앨범을 취득한다.
				var album = service.list[i];

				if( album.getName() == name) {
					//현재선택된 앨범을 저장하고 반환한다.
					return album;
				}
			}
			//찾는 앨범이 없은 경우, Null을 반환한다.
			return null;
		},
		getCurrentAlbum : function() {
			return service._currentAlbum;
		},
		setCurrentAlbum : function(album) {
			service._currentAlbum = album;
		}
	};
});
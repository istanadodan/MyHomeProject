
$.widget("ui.imageFrame",{
	_init:function(){
		var container = $('<div/>',{
			css:{
				height: "100px",
				width: "150px",
				border: this.options.border,
				padding: this.options.padding,
				verticalAlign: 'middle'
			}
		});

		var cover = $('<div/>', {
			css: {
				position: relative,
				width: "130px",
				top: "100px",
				overlayY: 'hidden'
			}
		});
		cover.append($(this.element)).after($(this.element),function() {
			$(this).remove();
		});
		console.log(this.element);
		$(this.elememt).css({
			border:'2px solid blue',
			padding:'1px'
		});
	}
});



app.service("jsonRepo1", function($http, $q){

	var _Album = function() {
		this.el = {
			list:[],		//파일목록
			name:null,		//앨범명
			idSelected:0,	//선택항목
		};
		this.getItem = function() {
			return this.el.list[this.el.idSelected];
		};
		this.setItem = function(item) {
			//_id保持
			this.el.list[this.el.idSelected].folder = item.folder;
			this.el.list[this.el.idSelected].dir = item.dir;
			this.el.list[this.el.idSelected].name = item.name;
			this.el.list[this.el.idSelected].width = item.width;
			this.el.list[this.el.idSelected].height = item.height;
		};
		this.getName = function() {
			return this.el.name;
		};
		this.setName = function(name) {
			this.el.name = name;
		};
		this.getList = function() {
			return this.el.list;
		};
		this.setList = function(list) {
			this.el.list = list;
		};
		this.getIdSelected = function() {
			return this.el.idSelected;
		};
		//no:화면표시되고 있는 혹은 클릭된 이미지의 고유번호
		this.setIdSelected = function(no) {
			this.el.idSelected = no;
		};
	};
	this._init = function() {
		this.albums = [];
		this.albumName = null;
		this.albumNameList = [];

	};

	this.init = function() {
		this._init();
		that = this;
		//フォルダ目録を取得する
		$http.get("/readDirList").then(
			function(res) {
			
				var dirList = res.data;

				for(var i=0; i < dirList.length; i++) {			
					that.albumNameList.push(dirList[i]._id);
				}
			});
	};
	//DBからデータを読み込み、ABLUMを更新
	//@param albumName 紐づき向けalbum名
	this._getAlbumFromDB = function(albumName) {

		var deferred = $q.defer();
		that = this;	
		$http.get('/readFileList?folder='+albumName).then(
			function(res) {
				var fileList = res.data;

				var album = new _Album();
				album.setName(albumName);
				album.setList(fileList);
				//取り込んだデータをobjectに格納	
				that.albums.push(album);
				//promiseを守る
				deferred.resolve(album);
			},
			function(msg, code) {
				deferred.reject(null);
			}
		);
	//promise statusを返却	
	return deferred.promise;
	};

	this._getAlbumSelected = function() {
		var albumName = this.getDir();
		//Ojbectで検索する
		for(var i=0;i<this.albums.length;++i) {
			if (this.albums[i].getName() == albumName)
				return this.albums[i];
		}
		return null;
	};
	// 앨범명이 존재하고 파일목록이 없는 경우 파일목록을 취득한다.
	this._syncList = function() {
		if(!this.isEmpty()) { 			//앨범명이 있으면,
			if(this._isEmptyList())		//파일목록이 비어있으면,
				this.this._getAlbumSelected().setList(this.getFileList());  //파일목록을 취득한다.
		}
	};
	this._makeAlbumNameList = function() {
		for(var i=0;i<this.albums.length;++i) {
			this.albumNameList.push(this.albums[i].getName());
		}
	};
	this.getDirList = function() {
		return this.albumNameList;
	};
	this.getFileList = function() {
		if( this.isEmpty() ) return [];
		// 앨범명이 존재하고 파일목록이 없는 경우 파일목록을 취득한다.
		this._syncList();
		
		return this._getAlbumSelected().getList();
	};
	this.getItem = function() {
		if( this.isEmpty() ) return null;		
		return this._getAlbumSelected().getItem();
	};
	this.isEmpty = function() {
		return this.albumName === null;
	};
	this._isEmptyList = function() {
		return this.albums === null;
	};
	this.getIndex = function() {
		if( this.isEmpty() ) return 0;
		//출력중인 앨범에서 index를 취득.
		return this._getAlbumSelected().getIdSelected();
	};
	this.setIndex = function(index) {
		//앨범이 존재할때 갱신.
		if(!this.isEmpty())
			this._getAlbumSelected().setIdSelected(index);
	};
	this.getDir = function() {
		if (this.albumName === null) {
			this.albumName = '161105-에비스 츠타야서점';
		}
		return this.albumName;
	};
	this.setDir = function(name) {		
		this.albumName = name;		
		//オブジェクトに該当アルバムがない、または探られたアルバムのアップデータが”０”の場合
		if ( this._getAlbumSelected() === null ) {
			return this._getAlbumFromDB(name);
		}
		
		return null;
	};
});


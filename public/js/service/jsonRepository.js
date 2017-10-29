angular.module("Slider.Common")

.service("jsonRepo2", function($album, albumModel, $q){

	this.init = function() {};
	
	this._getAlbumListFromDB = function() {
		//make an album name list
		return albumModel.all().then(function(res){
			var dirList = res.data;
			for(var i=0; i < dirList.length; i++) {
				//_id: folder name			
				$album.makeNameList(dirList[i]._id);
			}

			console.log("complete to bring in album list");
			return $album.getNameList();
		});
	};

	this._getAlbumFromDB = function(albumName) {
		//get file-list whose folder'name is allbumName.
		return albumModel.select(albumName).then(function(data){
			
			var album = $album.create();
			album.setName(albumName);
			album.setList(data);

			$album.setData(album);
			$album.setCurrentAlbum(album);			

			console.log("dbよりのファイルリスト",data);

			return album;
		});
	};

	this._getAlbumSelected = function() {
		return $album.getCurrentAlbum();
	};

	this._setAlbum = function(name) {
		var deferred = $q.defer();
		var album = $album.getData(name);

		if(album === null) {
			this._getAlbumFromDB(name).then(function(res) {
				deferred.resolve(res);
			});

		} else {
			//指定名を持つアルバムを現在アルバムに設定。
			$album.setCurrentAlbum(album);	
			deferred.resolve(null);
		}

		return deferred.promise;
	};

	this.getDirList = function() {
		var deferred = $q.defer();
		var list = $album.getNameList();

		if (list.length === 0) {
			this._getAlbumListFromDB().then(function(list){
				deferred.resolve(list);
			});	
		} else {
			deferred.resolve(list);
		}
		
		return deferred.promise;
	};

	this.getFileList = function() {
		if( this._isEmpty() ) {
			return [];
		}
		
		return this._getAlbumSelected().getList();
	};
	this.getItem = function() {
		if( this._isEmpty() ) {
			return null;
		}

		return this._getAlbumSelected().getItem();
	};

	this.getIndex = function() {
		if( this._isEmpty() ) {
			return 0;
		}
		//現在アルバムよりid取得.
		return this._getAlbumSelected().getIdSelected();
	};

	this.setIndex = function(index) {
		this._getAlbumSelected().setIdSelected(index);
	};

	this.getDir = function() {
		var album = this._getAlbumSelected();
		//アルバムが無い場合、ヌルを返却。
		if( album === null || album == 'undefined') {
			return null;
		} 

		return album.getName();	
	};
	this.setDir = function(name) {		
		return this._setAlbum(name);
	};

	this._isEmpty = function() {
		return $album.getCurrentAlbum() === null;
	};
});
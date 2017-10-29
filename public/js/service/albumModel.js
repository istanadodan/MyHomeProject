
angular.module("Slider.Common")

.service("albumModel", function($http, $album){
	var model = this;

	model.select = function(name) {
		var url = "/readFileList",
			query = "?folder=" + name; //album's name

		return $http.get(url + query).then(
			function(res) {
				console.log("url",url + query);
				return res.data;
			}
		);
	};

	model.writeOne = function(obj) {
		var url = "/writeOne";

		return $http.post(url, obj).then(function(res){
				console.log("dbにデータを正常にアップデータしました");
				return res;
		});
	};

	model.writeMany = function(obj) {
		var url = "/writeMany";

		return $http.post(url, obj).then(function(res){
				console.log("複数データをdbへ正常に記録しました");
				return res;
		});
	};

	model.all = function() {
		var url = "/albums/readDirList";

		return $http.get(url).then(
			function(res){				
				console.log("dbよりデータ取込後、返却完了");
				return res;
			}	
		);
	};

});
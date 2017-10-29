angular.module("Slider.Common")

.service("jsonRepo3", function($http){

	this._getAll = function(callback) {
		$http.get("/manage/revenue/all")
		.then(callback);
	};
	
	this._create = function(data, callback) {
		$http.post("/manage/revenue", {query:data})
		.then(callback);
	};

	this._drop = function(data, callback) {
		$http.post("/manage/revenue/delete", {query:data})
		.then(callback);
	};
});
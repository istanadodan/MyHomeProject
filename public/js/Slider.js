'use strict';
angular.module("Slider.Common", []);
angular.module("Slider.Ctrl", ["Slider.Common"]);

var Slider = angular.module("slider", [	
	"Slider.Common",
	"Slider.Ctrl",
	"ngRoute"
	]);

//handlebarsとの｛｛｝｝記号が重複されることを避ける
//Slider.config(function($interpolateProvider) {
//  $interpolateProvider.startSymbol('[[');
//  $interpolateProvider.endSymbol(']]');
//});

Slider.config(function($interpolateProvider, $routeProvider) {

	$routeProvider
    .when("/", {
        templateUrl : "start.html"
    })
    .when("/list", {
        templateUrl : "list.html"
    })
    .when("/slider", {
        templateUrl : "/views/slider.hbs"
    })
    .when("/register", {
        templateUrl : "register.html"
    })
    .otherwise({redirectTo:"/"});
    
	$interpolateProvider.startSymbol('{[{');
    $interpolateProvider.endSymbol('}]}');
});

Slider.config(function($logProvider){
    $logProvider.debugEnabled(false);
});

//Slider
//	.config(function ($httpProvider, $httpParamSerializerJQLikeProvider){
//	  $httpProvider.defaults.transformRequest.unshift($httpParamSerializerJQLikeProvider.$get());
//	  $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=utf-8';
//});

Slider.directive("debug",function($compile){
	return {
		terminal: true,
		priority: 1000000,
		link: function (scope, element) {
			var clone = element.clone();
			element.attr("style", "color:red");
			clone.removeAttr("debug");
			var clonedElement = $compile(clone)(scope);
			element.after(clonedElement);
		}
	}
});
Slider.run(function($rootScope){

	$rootScope.CONST = {
			"LOGO_URL" : "img/default.jpg",
			"START" : "START",
			"STOP"	: "STOP",
			"RESET" : "RESET",
			"RESTART" : "RESTART",
			"SHOW"	: "SHOW",
			"HIDE"	: "HIDE"
		};

	$rootScope.STATUS = {
			"LOGO"  : 0,
			"SMALL" : 1,
			"BIG"	: 2,
			"SLIDE" : 3,
			"FOLDER": 4,
			"LIST"	: 5
		};
	$rootScope.THUMB_SIZE = {
		"SMALL"		:'240px',
		"MIDDLE"	:'360px',
		"LARGE"		:'640px'
	};
	$rootScope.FLAG = {
		"ON"		:1,
		"OFF"		:0
	};
	$rootScope.DISP = {
		"LIST"		:1,
		"SLIDE"		:2,
		"REG"		:3
	};

});

angular.module("Slider.Common")

.service("Util", function() {
	var util = this;
	
	util.getUrl = function(url) {
		var ret ="Album 2016/";
		if(url && url!==null){
			ret += url.dir + url.name;
		} else {
		//	ret += getAttr("dir") + getAttr("name");
		}
		return ret;
	};
});
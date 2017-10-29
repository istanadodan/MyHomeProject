angular.module("Slider.Common")

.service("medi",function(){
	
	var _Vo = function(){
		this.exe = null;
	}; 
		_Vo.prototype = {
			set:function(func){
				this.exe = func;				
			},
			act:function(param){
				return this.exe(param);
			}
		};


	this.list = {};
	this.reg = function(name,action) {
		var el = new _Vo();
		el.set( action );
		
		//複数の機能を連続実行できる=>同じ機能が登録される問題発生。
		// if(this.list[name] === null)
		// 	this.list[name] = [el];
		// else 		
		this.list[name] = [el];
	};
	
	this.call = function(name,n) {
		if(!n) n=0;
		return this.list[name][n].act();
	};
	
	this.doo = function(name,param) {
		var action = this.list[name];
		//複数を勘案して
		for(var i=0;i<action.length;i++)
			action[i].act(param);
	};
});
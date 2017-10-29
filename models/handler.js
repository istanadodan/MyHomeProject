
var CRUID_TYPE = {FIND:1, SAVE:2, UPDATE:3, DELETE:4};

var ModelHandler = function(){
	this.data;
	this.cb;
	this.count;
	this.action;
	this.isArray;
	this.returnValue;
}
ModelHandler.prototype.init = function(data, callback, cruid_mode) {
	this.data = data;
	this.cb = callback;
	this.action = cruid_mode;
	this.count = this.totalCount = data.length || 0;
}
ModelHandler.prototype.setMode = function(cruid_mode) {
	this.action = cruid_mode;
}
ModelHandler.prototype.model = function(){
	if(this.totalCount==0)
		//1個処理
		return new Model(this.data);
	else 
		return this.getModelMany();
}
ModelHandler.prototype.getModelMany = function(){	
	var element = this.data.pop();	
	this.count--;
	return new Model(this.element);
}

ModelHandler.prototype.execute = function() {
	var model = this.model();

	if(this.action == CRUID_TYPE.SAVE) {
		model.save(this.callback.bind(this));

	} else if(this.action == CRUID_TYPE.DELETE) {
		model.remove(this.callback.bind(this));
	}
}
ModelHandler.prototype.callback = function(err, result) {		
	this.returnValue.push(result.data);
	
	if(this.count==0) {
		this.cb(err, {count:this.returnValue.length || 1});
		return;
	} 

	this.execute();
}

module.exports = {Handler:ModelHandler, CRUID_TYPE:CRUID_TYPE};
var mongoose = require('mongoose');

var schema = mongoose.Schema({
	item_name: {
		type:String
	},
	category:{
		type:String
	},
	dte: {
		type:String
	},
	amount: {
		type:String
	},
	place: {
		type:String
	},
	pay_method:{
		type: String	
	}
});

var Model = module.exports = mongoose.model("expense", schema,"expense");

module.exports.getAll = function(callback) {
	/*
	 * 参考
	 * Model.find({ size: 'small' }).where('createdDate').gt(oneYearAgo).exec(callback);
	 */
	Model.find({}, callback);
  };
  
module.exports.create1 = function(data, callback) {
	if(data.length == 0) {
		return null;
		
	} else if(data.length ==1) {
		var model = new Model(data);
		model.save(callback);
	} else {
		saveAll(data, callback);
	}
}  

function saveAll(data, callback) {
	
	var el = data.pop();
	var model = new Model(el);
	console.log("counter=",data.length);
	
	model.save(function(err, result){
		if (err) {
			throw err;			
		}
		if(data.length==0) {
			callback(result);
		} else {
			saveAll(data, callback);
		}		
	});
}

module.exports.create10= function(data, callback) {
	var modelHandler = new ModelHandler();

	modelHandler.init(data, callback, CRUID_TYPE.SAVE);
	modelHandler.execute();
} 

module.exports.remove10 = function(data, callback) {	
	var modelHandler = new ModelHandler();

	modelHandler.init(data, callback, CRUID_TYPE.DELETE);
	modelHandler.execute();
} 

/*
   Handler corresponding to CRUID request.
   @author	: kdy
   @data	: 2017.10.28
   @version	: 1
*/
var CRUID_TYPE = {FIND:1, SAVE:2, UPDATE:3, DELETE:4};

var ModelHandler = function(){
	this.data;
	this.cb;
	this.action;
	this.totalCount;
}
ModelHandler.prototype.init = function(data, callback, cruid_mode) {
	this.data = data;
	this.cb = callback;
	this.action = cruid_mode;
	this.totalCount = data.length || 0;
}
ModelHandler.prototype.execute = function() {
	
	if(this.totalCount==0)
		this.callback();
	
	//model取得
	var element = this.data.shift();
	
	//db処理
	if(this.action == CRUID_TYPE.SAVE) {
		/*
		 *Model.update({_id:element._id}, element, {'new':true, upsert:true}, this.callback.bind(this));
		 *生成の際、_idにヌルが入る。
		 */
		if(!element._id) {
			//追加
			Model.create(element, this.callback.bind(this));
		} else {
			//修正
			Model.findOneAndUpdate({_id:element._id}, element, {upsert: true}, this.callback.bind(this));
		}
		//削除
	} else if(this.action == CRUID_TYPE.DELETE) {
			Model.remove({_id:element._id}, this.callback.bind(this));	
	}
}
ModelHandler.prototype.callback = function(err, result) {		
	if(this.data.length==0) {
		this.cb(err, {count:this.totalCount});
		return;
	} 

	this.execute();
}
 
  
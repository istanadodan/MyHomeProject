var mongoose = require('mongoose');

var schema = mongoose.Schema({
	folder: {
		type:String
	},
	dir:{
		type:String
	},
	name: {
		type:String
	},
	width: {
		type:String
	},
	height: {
		type:String
	},
	description:{
		type: String	
	}
});

var Model = module.exports = mongoose.model("person", schema,"description");

module.exports.getDirList = function(callback) {
// 	var Album = new Model({
// 		folder:'test',
// 		dir:'test',
// 		name:'test',
// 		width:'test',
// 		height:'test',
// 		description:'test'
// 	});

// 	Album.save(Album);

// 	Model.find({}, function(err, result){
// 			console.log(result);
// 			callback(err, result);
// });
	Model.aggregate([
		{$group:
			{_id:"$folder"}
		},
		{$sort:
		 	{_id:-1}
		}], 
		
		function(err, result){
			callback(err, result);
		}
	);
  };
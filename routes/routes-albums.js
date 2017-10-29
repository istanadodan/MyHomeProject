var express = require('express');
var router = express.Router();
var Album = require('../models/models-album');


router.get("/readDirList", function(req, res) {
	// var album = new Album({
	// 	decription:req.param.folder
	// });
	Album.getDirList(function(err, album){
		res.send(album);
	});
});

module.exports = router;
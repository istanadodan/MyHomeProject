/**
 * published on 21 Oct, 2017
 * by DY KWON
 * version 1.0
 */

const express = require('express');
const router = express.Router();
const model = require('../models/models-revenue');

router.post('/revenue/delete', function(req, res) {
	var data = req.body.query;

	model.remove10(data, function(err, result){
		if (err) {
			res.send('error');
			return false;
		}
		res.send(result);
	})
});

router.post('/revenue', function(req, res) {
	var data = req.body.query;

	model.create10(data, function(err, result){
		if (err) {
			res.send('error');
			return false;
		}
		res.send(result);
	});
});

router.get('/revenue/all', function(req, res){
	
	model.getAll(function(err, result){
		res.send(result);		
	});
});

router.get('/revenue', function(req, res){
	
	model.getAll(function(err, result){
		//console.log("result",result);
		var data = result;
		if (result.length==0) {
			data = [{
				item_name:'식료품',
				category:'생활비',
				dte:'2017-10-20',
				amount:'1000',
				place:'신주쿠',
				pay_method:'카드'
			}];
		}
		
		res.render('revenue/index',{
			data:data
		});
		
	});
	
});

module.exports = router;
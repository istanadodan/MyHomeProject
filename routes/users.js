const express = require('express');
const router = express.Router();

router.get('/slider', function(req, res){
	res.render('slider');
});

router.get('/register', function(req, res){
	res.render('register');
});

module.exports = router;
/*
	Project for slider publised in Oct. 7 2017 by dy kwon
*/

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var Handlebars = require('handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/test',{
	useMongoClient:true
	});
		
var routes = require('./routes/index');
var users = require('./routes/users');
var albums = require('./routes/routes-albums');
var manage = require('./routes/routes_manage');

//init app
var app = express();
var rootDir = 'D://내사진//Album 2016';

//view engin
var exphandlebars = exphbs.create(
			{
				extname:'.hbs', 
				layoutsDir:'views/layout',
				defaultLayout:'template',
				helpers:{
					showTitle:true,
					greeting:function(){
						return 'Welcome to Slider ' + __dirname;
					}
				}
			}
	);

// Handlebars.registerHelper('angular-js', function(options) {
//     return options.fn();
// });

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('.hbs', exphandlebars.engine);

//set body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());

//set static foder
app.use(express.static(path.join(__dirname, 'public')));

//express session
app.use(session({
	secret:'secrete',
	saveUninitialized:true,
	resave:true
}));

app.use(expressValidator({
	errorFormatter: function(param, msg, value) {
		var namespace = param.split('.')
		, root = namespace.shift()
		, formParam = root;

		while(namespace.length) {
			formParam += '[' + namespace.shift() + "]";
		}
		return {
			param : formParam,
			msg : msg,
			value : value
		};
	}
}));

// connect flash
app.use(flash());

//global vars
app.use(function(req, res, next){
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	// res.Locals.error = req.flash('error');
	next();
});

//set image directory pos
app.use('/album', express.static(rootDir));

//routing
app.use('/', routes);
app.use('/users', users);
app.use('/albums', albums);
app.use('/manage', manage);
 
// set port
app.set('port', (process.env.PORT || 3000));
app.listen(app.get('port'), function(){
	console.log('Server started on port' + app.get('port'));
});
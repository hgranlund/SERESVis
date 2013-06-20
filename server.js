var http = require("http");
var url = require("url");
var express = require('express');
var path = require('path');
var cheerio = require('cheerio');

var app = express();

app.configure(function(){
	app.set('port', process.env.PORT || 1337);
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
	app.use(express.errorHandler());
});

app.get('/', function(req, res){
	res.sendfile("index.html");
})

var server = http.createServer(app).listen(app.get('port'), function(){
	console.log("Express server listening to port " + app.get('port'));
});
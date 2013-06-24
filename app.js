var http = require('http');
var express = require('express');
var ecstatic = require('ecstatic');

var app = express();
app.use(ecstatic({ root: __dirname + '/public' }));
http.createServer(app).listen(8080);

console.log('Listening on :8080');
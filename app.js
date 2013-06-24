var http = require('http');
var express = require('express');
var ecstatic = require('ecstatic');

var app = express();
app.use(ecstatic({ root: __dirname + '/public' }));
http.createServer(app).listen(8080);

function renderNewPostForm(request, response) {
    response.writeHead(200, {
        'Content-type': 'text/html; charset=utf-8'
    });
    response.end(newPostFormHTML);
};

function render404(request, response) {
    response.writeHead(404);
    response.end('404 File not found');
}

var server = http.createServer(function(request, response) {
    var newPostFormRegex = new RegExp('^/?$');
    var pathname = url.parse(request.url).pathname;
    if (newPostFormRegex.test(pathname)) {
      renderNewPostForm(request, response);
  } else {
      render404(request, response);
  } 
});

server.listen(8000);

console.log('Listening on :8080');

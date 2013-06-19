var querystring = require("querystring");

function start(response) {
	console.log("Request handler 'start' was called.");
	var body = '<html>'+
	'<head>'+
	'<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />'+
	'</head>'+
	'<body>'+
	'<h1>'+
		'Dette er en test av node.js' +
	'</h1>'+
	'</body>'+
	'</html>';

	
	response.writeHead(200, {"Content-Type": "text/html; charset=UTF-8"});
	response.write(body);
	response.end();
}

function upload(response) {
	console.log("Request handler 'upload' was called.");
	response.writeHead(200, {"Content-Type": "text/plain; charset=UTF-8"});
	response.write("Hello World");
	response.end();
}

exports.start = start;
exports.upload = upload;
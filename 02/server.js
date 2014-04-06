var http = require('http');//built-in http module provides HTTP server and client functionality
var fs = require('fs');//buillt-in fs module provides filesystem related functionality
var path = require('path');//built-in path module provides filesystem path-related functionality
var mime = require('mime');//add-on mime module provides ability to derive a MIME type based on a filename extension
var cache = {}; //cache object is where the contents of cached files are stored
var chatServer = require('./lib/chat_server');

function send404 (response) {
	response.writeHead(404, {'Content-Type': 'text/plain'});
	response.write('Error 404: resource not found');
	response.end();
};

function sendFile (response, filePath, fileContents) {
	response.writeHead(200, {
		'Content-Type': mime.lookup(path.basename(filePath))
	});
	response.end(fileContents);
};

function serverStatic (response, cache, absPath) {
	if (cache[absPath]) { //check if file is cached in memory
		sendFile(response, absPath, cache[absPath]); //serve file from memory
	} else {
		fs.exists(absPath, function(exists) { //check if file exist
			if (exists) {
				fs.readFile(absPath, function(err, data) { //read file from disk
					if (err) {
						send404(response);
					} else {
						cache[absPath] = data;
						sendFile(response, absPath, data);
					}
				});
			} else {
				send404(response);
			}
		});
	}
};

var server = http.createServer(function (request, response) { 
//create HTTP server, using anonymous function to define per-request behavior
	var filePath = false;

	if (request.url == '/') {
		filePath = 'public/index.html'; //determine HTML file to be served by defult
	} else {
		filePath = 'public' + request.url; //translate URL path to relative file path
	};
	var absPath = './' + filePath;
	serverStatic(response, cache, absPath); //serve static file
});

server.listen(3000, function(){
	console.log('Server listening on port 3000');
});

chatServer.listen(server);
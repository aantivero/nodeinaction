//forma explicita de declarar un server
var http = require('http');
var server = http.createServer();
server.on('request', function (req, res) {
	res.writeHead(200, {'Content-Type': 'text/plain'});
	res.end('Hello World');
});
server.listen(3000);
console.log('server running http://localhost:3000/');
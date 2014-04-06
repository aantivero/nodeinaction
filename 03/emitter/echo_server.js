var net = require('net');

var server = net.createServer(function(socket) {
	socket.on('data', function(data) {
		console.log(data);
		socket.write(data);
	});
	/*socket.once('data', function(data) {
		console.log(data.toString());
		socket.write(data);
	});*/
});

server.listen(8888);
console.log('start server listen on port 8888');
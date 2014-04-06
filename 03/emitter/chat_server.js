var events = require('events');
var net = require('net');

var channel = new events.EventEmitter();
channel.clients = {};
channel.subscriptions = {};

//add a listener for the join event that stores a user's client objet
//allowing the application to send data back to the user.

channel.on('join', function(id, client) {
	//mensaje bienvenida
	var msg = "Bienvenido\n" 
			+ 'usuarios en línea:' + this.listeners('broadcast').length;
	client.write(msg + '\n');
	this.clients[id] = client;
	this.subscriptions[id] = function(senderId, message) {
		//ignore data if its been directly broadcast by the user.
		if (id != senderId) {
			this.clients[id].write(message);
		}
	};
	//add a listener specific to the current user for the broadcast event.
	this.on('broadcast', this.suscriptions[id]);
});

//create listener for leave event
channel.on('leave', function(id) {
	//remove broadcast listener for specific client
	channel.removeListener('broadcast', this.subscriptions[id]);
	channel.emit('broadcast', id, id + " has left.\n");
});

channel.on('shutdown', function() {
	channel.emit('broadcast', '', "Chat has shut down.\n");
	channel.removeAllListeners('broadcast');
});

channel.on('error', function(err) {
	console.log('ERROR: ' + err.message);
});

var server = net.createServer(function (client) {
	var id = client.remoteAddress + ':' + client.remotePort;
	//emit a join event when a user connects to the server specifiyng the user id and client object
	client.on('connect', function() {
		channel.emit('join', id, client);
	});
	//emit a channel broadcast event specifying the user id and message, when any user send data
	client.on('data', function(data) {
		data = data.toString();
		console.log(data);
		if (data == "shutdown\r\n") {
			channel.emit('shutdown');
		}
		channel.emit('broadcast', id, data);
	});
	//emit leave event when client disconnects
	client.on('close', function() {
		channel.emit('leave', id);
	});
	//error handler
	client.on('error', function() {
		channel.emit('error', new Error('Ocurrio un error inesperado'));
	});
});

server.listen(8888);
/*
 * constructor, directorio para monitorear,
 * directorio donde dejar los archivos.
 */
function Watcher(watchDir, proccessedDir) {
	this.watchDir = watchDir;
	this.proccessedDir = proccessedDir;
}

//agregar la herencia de event emitters
var events = require('events');
var util = require('util');

util.inherits(Watcher, events.EventEmitter);

var fs = require('fs'), 
	watchDir = './watch',
	proccessedDir = './done';

//extend eventemitter with methd that processes files
Watcher.prototype.watch = function () {
	//guardar la referencia para usar en readdir
	var watcher = this;
	fs.readdir(this.watchDir, function(err, files){
		if(err)throw err;
		for (var index in files){
			//procesar cada archivo en el directorio
			watcher.emit('process', files[index]);
		}
	});
};

//extend EventEmitter with method to start watching
Watcher.prototype.start = function() {
	var watcher = this;
	fs.watchFile(watchDir, function(){
		watcher.watch();
	});
};

//creacion de un objeto
var watcher = new Watcher(watchDir, proccessedDir);

watcher.on('process', function process(file){
	var watchFile = this.watchDir + '/' + file;
	var proccessedFile = this.proccessedDir + '/' + file.toLowerCase();
	fs.rename(watchFile, proccessedFile, function(err){
		if(err)throw err;
	});
});

watcher.start();
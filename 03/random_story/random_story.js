/**
 * Created by Alejandro Antivero on 06/04/2014.
 * Aplicación simple donde se implementa serial flow control
 */
var fs = require('fs');
//es un cliente http simple para manipular datos RSS
var request = require('request');
//tiene funcionalidad para manejar datos RSS dentro de estructuras javascripts
var htmlparser = require('htmlparser');
var configFilename = './rss_feeds.txt';

//Task 1: asegurarse que el archivo que contiene la lista de urls RSS existe.
function checkForRSSFile(){
    fs.exists(configFilename, function(exists){
       //al existir un error termina
       if(!exists)return next(new Error('El archivo RSS no existe:'+configFilename));
       next(null, configFilename);
    });
}

//Task 2: leer y parsear el archivo con las URLs
function readRSSFile(configFilename){
    fs.readFile(configFilename, function(err, feedList){
        if(err) return next(err);
        //convertir la lista de URLs en un String y luego en un Array de feed URLs
        feedList = feedList.toString().replace(/^\s+|\s+$/g, '').split("\n");
        //seleccionar aleatoriamente una feed URL del Array.
        var random = Math.floor(Math.random()*feedList.length);
        next(null, feedList[random]);
    });
}

//Task 3: crear un request HTTP y obtener los datos del feed elegido
function downloadRSSFeed(feedUrl){
    request({uri: feedUrl}, function(err, res, body){
        if(err) next(err);
        if(res.statusCode != 200)
            return next(new Error('Error en la respuesta'));
        next(null, body);
    });
}

//Task 4: parsear dato RSS dentro de un array items
function parseRSSFeed(rss){
    var handler = new htmlparser.RssHandler();
    var parser = new htmlparser.Parser(handler);
    parser.parseComplete(rss);

    if(!handler.dom.items.length)
        return next(new Error('No se encontraron RSS items'));

    var item = handler.dom.items.shift();
    console.log(item.title);
    console.log(item.link);
}

//agregar cada tarea que se ejecutará dentro de un array
var tasks = [checkForRSSFile, readRSSFile, downloadRSSFeed, parseRSSFeed];

//función para ejecutar cada tarea
function next(err, result){
    if(err)throw err;
    //la próxima tarea proviene del array de tareas
    var currentTask = tasks.shift();
    if(currentTask){
        //ejecutar la tarea actual
        currentTask(result);
    }
}

next();
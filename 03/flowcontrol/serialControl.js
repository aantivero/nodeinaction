/**
 * Created by Alejandro Antivero on 06/04/2014.
 * Usando Nimble como herramienta para el flow-control
 */
var flow = require('nimble');
//un array con la funciones para Nimble que las ejecutara una tras otra
flow.series([
    function(callback) {
        setTimeout(function(){
           console.log('I execute first');
            callback();
        }, 1000);
    },
    function(callback) {
        setTimeout(function(){
           console.log('I execute next.');
           callback();
        }, 500);
    },
    function(callback) {
        setTimeout(function(){
            console.log('I execute last.');
            callback();
        }, 100);
    }
]);
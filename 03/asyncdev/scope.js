/*
Utiliza un función anonima para preservar el valor de la variable global
Esto se denomina closures
 */

function asyncFunction(callback) {
	setTimeout(callback, 200);
}

var color = 'blue';

asyncFunction(function() {
	console.log('color: ' + color);
});

color = 'green';
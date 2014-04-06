/*
* using an anonymous function to preserve a global variable's value
*/
function asyncFunction(callback) {
	setTimeout(callback, 200);
}

var color = 'blue';

(function(color) {
	asyncFunction(function() {
		console.log('Color '+ color);
	});
})(color);

color = 'green';
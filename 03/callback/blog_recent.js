var http = require('http');
var fs = require('fs');

//create http server and use callback to define response logic
http.createServer(function(req, res) { 
	if (req.url == '/') {
		//read json file and use callback to define what to do with its content
		fs.readFile('./titles.json', function(err, data) {
			if (err) {
				console.error(err);
				res.end('Server Error');
			} else {
				var titles = JSON.parse(data.toString());
				
				fs.readFile('./template.html', function(err, data) {
					if (err) {
						console.error(err);
						res.end('Server Error');
					} else {
						var tmpl = data.toString();
						var html = tmpl.replace('%', titles.join('</li><li>'));
						res.writeHead(200, {'Content-Type': 'text/html'});
						res.end(html);
					}
				});
			}
		});
	}
}).listen(8000);
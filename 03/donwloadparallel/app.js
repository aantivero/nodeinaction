/**
 * Created by Alejandro Antivero on 07/04/2014.
 * Esta aplicación tiene por proposito ejemplificar el uso de componentes externos y el flow-control parallel
 */

var flow = require('nimble');
var exec = require('child_process').exec;

//hacer downlod de cierta version
function downloadNodeVersion(version, destination, callback){
    var url = 'http://nodejs.org/dist/node-v' + version + '.tar.gz';
    var filepath = destination + '/' + version + '.tgz';
    exec('curl ' + url + ' >' + filepath, callback);
}

//ejecutar seria de tareas en secuencia
flow.series([
    function(callback){
        //ejecutar tareas en paralelo
        flow.parallel([
            function(callback){
                console.log('Donwloading Node v0.4.6...');
                downloadNodeVersion('0.4.6', '/tmp', callback);
            },
            function(callback){
                console.log('Donwloading Node v0.4.7...');
                downloadNodeVersion('0.4.7', '/tmp', callback);
            }
        ], callback);
    },
    function (callback){
        console.log('Creating archives of donwloaded files...');
        //crear un archivo con las versiones bajadas
        exec(
            'tar cvf node_distros.tar /tmp/0.4.6.tgz /tmp/0.4.7.tgz',
            function(err, stdout, stderr){
                console.log('All done');
                callback();
            }
        );
    }
]);
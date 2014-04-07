/**
 * Created by Alejandro Antivero on 06/04/2014.
 */
var fs = require('fs');
var completedTasks = 0;
var tasks = [];
var wordCounts = {};
var filesDir = './text';

function checkIfComplete(){
    completedTasks++;
    if(completedTasks == tasks.length){
        //cuando todas las tareas finalizan se imprime cada palabra y cuantas veces fue usada.
        for(var index in wordCounts){
            console.log(index + ': ' +wordCounts[index]);
        }
    }
}

function countWordsInText(text){
    var words = text
        .toString()
        .toLowerCase()
        .split(/\W+/)
        .sort();
    //contar la cantidad de veces que aparece la palabra en el texto.
    for(var index in words){
        var word = words[index];
        if(word){
            wordCounts[word] = (wordCounts[word])? wordCounts[word] + 1 : 1;
        }
    }
}

fs.readdir(filesDir, function(err, files){
    if(err) throw err;
    for(var index in files){
        var task = (function(file){
            return function(){
                fs.readFile(file, function(err, text){
                    if(err)throw err;
                    countWordsInText(text);
                    checkIfComplete();
                });
            }
        })(filesDir + '/' + files[index]);
        tasks.push(task);
    }
    for(var task in tasks){
        //llamar a la funcion
        tasks[task]();
    }
});


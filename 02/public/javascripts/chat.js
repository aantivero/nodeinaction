/**
 * Created by alex on 31/03/2014.
 */
//start js equivalent of a class that takes a single argument, a socket, when instantiated
var Chat = function(socket) {
    this.socket = socket;
};
//function to send chat message
Chat.prototype.sendMessage = function(room, text) {
  var message = {
    room: room,
    text: text
  };
  this.socket.emit('message',message);
};
//function to change room
Chat.prototype.changeRoom = function(room) {
  this.socket.emit('join', {
     newRoom: room
  });
};
//for processing a chat command
Chat.prototype.processCommand = function(command) {
  var words = command.split(' ');
  //parse command from first word
  var command = words[0].substring(1, words[0].length).toLowerCase();
  var message = false;

  switch(command){
      case 'join':
          //handle room changing/creating
          words.shift();
          var room = words.join(' ');
          this.changeRoom(room);
          break;
      case 'nick':
          //handle name change attempts
          words.shift();
          var name = words.join(' ');
          this.socket.emit('nameAttempt', name);
          break;
      default:
          //return error message if command isn't recognized
          message = 'Comando desconocido';
          break;
  }
  return message;
};

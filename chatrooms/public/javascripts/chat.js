
var Chat = function (socket) {
  this.socket = socket;
};

// チャットメッセージを送信
Chat.prototype.sendMessage = function (room, text) {
  var message = {
    room: room,
    text: text
  };
  this.socket.emit('message', message);
};

// ルームを変更
Chat.prototype.changeRoom = function (room) {
  this.socket.emit('join', {
    newRoom: room
  });
};

// チャットコマンドの処理
Chat.prototype.processCommand = function (commands) {
  var words = commands.split(' ');
  var command = words[0]
      .substr(1, words[0].length)
      .toLocaleLowerCase();
  var message = false;

  switch(command) {
    case 'join':
      words.shift();
      var room = words.join(' ');
      this.changeRoom(room);
      break;

    case 'nick':
      words.shift();
      var name = words.join(' ');
      this.socket.emit('nameAttempt', name);
      break;

    default:
      message = 'Unrecognized command.';
      break;
  }
  return message;
};
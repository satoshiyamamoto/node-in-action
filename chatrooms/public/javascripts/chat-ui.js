
function divEscapedContentElement(message) {
  return $('<div></div>').text(message);
}

function divSystemContentElement(message) {
  return $('<div></div>').html('<i>' + message + '</i>');
}

function processUserInput(chatApp, socket) {
  var message = $('#send-message').val();
  var systemMessage;

  // スラッシュで始まる入力はコマンド
  if (message.charAt(0) == '/') {
    systemMessage = chatApp.processCommand(message);
    if (systemMessage) {
      $('#messages').append(divSystemContentElement(systemMessage));
    }
  } else {
    // コマンド以外は他のユーザにブロードキャスト
    chatApp.sendMessage($('#room').text(), message);

    $('#messages').append(divEscapedContentElement(message));
    $('#messages').scrollTop($('#messages').prop('scrollHeight'));
  }

  $('#send-message').val('');
}

var socket = io.connect();

$(document).ready(function() {
  var chatApp = new Chat(socket);

  // 名前変更要求の結果を表示
  socket.on('nameResult', function (result) {
    var message;

    if (result.success) {
      message = 'You are now known as  ' + result.name + '.';
    } else {
      message = result.message;
    }
    $('#messages').append(divSystemContentElement(message));
  });

  // ルーム変更の結果表示
  socket.on('joinResult', function (result) {
    $('#room').text(result.room);
    $('#messages').append(divSystemContentElement('Room changes.'));
  });

  // 受診したメッセージを表示
  socket.on('message', function (message) {
    var newElement = $('<div></div>').text(message.text);
    $('#messages').append(newElement);
  });

  // 利用できるルームのリストを表示
  socket.on('rooms', function (rooms) {
    $('#room-list').empty();
    for(var room in rooms) {
      room = room.substring(1, room.length);
      if (room != '') {
        $('#room-list').append(divEscapedContentElement(room));
      }
    }

    // ルーム名をクリックするとその部屋に移動できる
    $('#room-list div').click(function () {
      chatApp.processCommand('/join ' + $(this).text());
      $('#send-message').focus();
    });
  });

  // 利用できるルームのリストを更新
  setInterval(function () {
    socket.emit('rooms');
  }, 1000);

  $('#send-message').focus();

  // チャットメッセージ送信
  $('#send-form').submit(function (e) {
    e.preventDefault();
    processUserInput(chatApp, socket);
    return false;
  });
});
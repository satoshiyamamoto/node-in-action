
var socketio = require('socket.io'),
  io,
  guestNumber = 1,
  nickNames = {},
  namesUsed = [],
  currentRoom = {};

// Socket.IOサーバを始動する
exports.listen = function (server) {
  io = socketio.listen(server); // 既存のHTTPサーバに相乗りさせる
  io.set('log level', 1);
  // 各ユーザ接続の処理方法を定義
  io.sockets.on('connection', function (socket) {
    guestNumber = assignGuestName(socket, guestNumber, nickNames, namesUsed);
    // Lobbyに入れる
    joinRoom(socket, 'Lobby');
    // 'message', 'nameAttempt', 'join' の要求を処理
    handleMessageBroadcasting(socket, nickNames);
    handleNameChangeAttempts(socket, nickNames, namesUsed);
    handleRoomJoining(socket);
    // ユーザの要求に応じて使用されているルームのリストを供給
    socket.on('rooms', function() {
      socket.emit('rooms', io.sockets.manager.rooms);
    });
    // 接続を断った時のクリーンアップ
    handleClientDisconnection(socket, nickNames, namesUsed);
  });
};

// ゲスト名の割り当て
function assignGuestName(socket, guestNumber, nickNames, nameUsed) {
  var name = 'Guest' + guestNumber;
  nickNames[socket.id] = name; // ゲスト名にクライアント接続IDを関連づけ
  socket.emit('nameResult', {  // ユーザにゲスト名を通知
    success: true,
    name: name
  });
  nameUsed.push(name); // このゲスト名を使ったことを記録
  return guestNumber + 1; // ゲスト名の生成に使うカウンタをインクリメント
}

// ルームへの参加に関するロジック
function joinRoom(socket, room) {
  socket.join(room);
  currentRoom[socket.id] = room; // 参加したことを記録
  socket.emit('joinResult', {room: room}); // 入ったことを知らせる
  // ルームのユーザに入室したことを知らせる
  socket.broadcast.to(room).emit('message', {
    text: nickNames[socket.id] + 'has joined ' + room + '.'
  });

  // 同じルームに他に誰がいるのかの判定
  var usersInRoom = io.sockets.clients(room);

  // もし他にユーザがいたらその概要を作る
  if (usersInRoom.length > 1) {
    var usersInRoomSummary = 'Users currently in ' + room + ': ';
    for (var index in usersInRoom) {
      var userSocketId = usersInRoom[index].id;
      if (userSocketId != socket.id) {
        if (index > 0) {
          usersInRoomSummary += ', ';
        }
        usersInRoomSummary += nickNames[userSocketId];
      }
    }

    // 同じルームにいる他のユーザの概要をこのユーザに送る
    usersInRoomSummary += '.';
    socket.emit('message', {text: usersInRoomSummary});
  }
}

// 名前変更を試みる要求を処理するロジック
function handleNameChangeAttempts(socket, nickNames, namesUsed) {
  socket.on('nameAttempt', function (name) {
    // Guestで始まるニックネームは許可しない
    if (name.indexOf('Guest') == 0) {
      socket.emit('nameResult', {
        success: false,
        message: 'Names cannot begin with "Guest."'
      });
    } else {
      // もし名前が未登録ならば登録する
      if (namesUsed.indexOf(name) == -1) {
        var previousName = nickNames[socket.id];
        var previousNameIndex = namesUsed.indexOf(previousName);
        namesUsed.push(name);
        nickNames[socket.id] = name;
        // 他のクライアントが使えるように以前の名前を登録削除する
        delete namesUsed[previousNameIndex];

        socket.emit('nameResult', {
          success: true,
          name: name
        });
        socket.broadcast.to(currentRoom[socket.id]).emit('message', {
          text: previousName + ' is now known as ' + name + ','
        });
      } else {
        // 名前が登録済みならユーザにエラーを送信
        socket.emit('nameResult', {
          success: false,
          message: 'That name is already in use.'
        });
      }
    }
  })
}

function handleMessageBroadcasting(socket) {
  socket.on('message', function (message) {
    socket.broadcast.to(message.room).emit('message', {
      text: nickNames[socket.id] + ': ' + message.text
    });
  });
}

function handleRoomJoining(socket) {
  socket.on('join', function (room) {
    socket.leave(currentRoom[socket.id]);
    joinRoom(socket, room.newRoom);
  })
}

function handleClientDisconnection(socket) {
  socket.on('disconnect', function () {
    var nameIndex = namesUsed.indexOf(nickNames[socket.id]);
    delete namesUsed[nameIndex];
    delete nickNames[socket.id];
  });
}
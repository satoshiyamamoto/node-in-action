var events = require('events');
var net = require('net');

var channel = new events.EventEmitter();
channel.clients = {};
channel.subscriptions = {};

channel.on('join', function (id, client) {
  this.clients[id] = client;
  this.subscriptions[id] = function (senderId, message) {
    if (id != senderId) {
      this.clients[id].write(message);
    }
  };
  this.on('broadcast', this.subscriptions[id]);
});

channel.on('leave', function (id) {
  channel.removeListener('broadcast', this.subscriptions[id]);
  channel.emit('broadcast', id, id + ' has left the chat.\n');
});

channel.on('shutdown', function () {
  channel.emit('broadcast', '', 'Chat has shutdown.\n');
  channel.removeAllListeners('broadcast');
});

channel.on('join', function (id, client) {
  var welcome = 'Welcome!\n' +
                'Guests online: ' + this.listeners('broadcast').length;
    client.write(welcome + '\n');
});

var server = net.createServer(function (client) {
  var id = client.remoteAddress + ':' + client.remotePort;
  channel.emit('join', id, client);
  client.on('data', function (data) {
    data = data.toString();
    if (data == 'shutdown\r\n') {
      channel.emit('shutdown');
    }
    channel.emit('broadcast', id, data);
  });
});
server.listen(8888);
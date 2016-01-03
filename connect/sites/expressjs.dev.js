var http = require('http');

var server = http.createServer(function (req, res) {
  res.end('hello from expressjs.com\n');
});

module.exports = function (req, res) {
  server.emit('request', req, res);
};

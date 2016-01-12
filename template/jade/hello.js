// template/jade/hello.js
var jade = require('jade');
var http = require('http');
var option = {};

http.createServer(function (req, res) {
  res.setHeader('Content-Type', 'text/html');
  res.end(jade.renderFile('./views/basic.jade', option));
}).listen(3000);


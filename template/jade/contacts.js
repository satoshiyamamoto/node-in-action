// template/jade/hello.js
var jade = require('jade');
var fs = require('fs');
var http = require('http');
var template = fs.readFileSync('./views/contacts.jade', 'utf8');

var contacts = fs.readFileSync('../contacts.json', 'utf8');
var context = JSON.parse(contacts);
var fn = jade.compile(template);

http.createServer(function (req, res) {
  res.setHeader('Content-Type', 'text/html');
  res.end(fn(context));
}).listen(3000);


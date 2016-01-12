// template/ejs/students.js

var ejs = require('ejs');
var fs = require('fs');
var http = require('http');
var filename = './views/students.ejs';
var students = fs.readFileSync('../students.json', 'utf8');
var context = JSON.parse(students);


var server = http.createServer(function (req, res) {
  if (req.url == '/') {
    fs.readFile(filename, function (err, data) {
      var template = data.toString();
      var output = ejs.render(template, context);
      res.setHeader('Content-Type', 'text/html');
      res.end(output);
    });
  } else {
    res.statusCode = 404;
    res.end('Not fount');
  }
});

server.listen(8000);
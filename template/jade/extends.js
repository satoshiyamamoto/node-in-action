// template/jade/extends.js
var jade = require('jade');
var fs = require('fs');
var http = require('http');
var pageFile = './views/page.jade';
var page = fs.readFileSync(pageFile);

var students = fs.readFileSync('../students.json', 'utf8');
students = JSON.parse(students);
var messages = [
  'You have logged in successfully.',
  'Welcome back!'
];
var context = {
  messages: messages,
  students: students.students
};

http.createServer(function (req, res) {
  var pageFn = jade.compile(page, {filename: pageFile});
  res.setHeader('Content-Type', 'text/html');
  res.end(pageFn(context));
})
.listen(3000);
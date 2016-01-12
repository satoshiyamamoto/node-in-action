// template/hogan/partial.js
var hogan = require('hogan.js');
var fs = require('fs');
var students = fs.readFileSync('../students.json', 'utf8');
var context = JSON.parse(students);

var studentTemplate =
  '<p>Name: {{name}}</p>' +
  'Age: {{age}}';
var mainTemplate =
  '{{#students}}' +
  '{{>student}}' +
  '{{/students}}';



// inject partial
var template = hogan.compile(mainTemplate);
var partial = hogan.compile(studentTemplate);
var html = template.render(context, {student: partial});

console.log(html);
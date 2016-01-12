// template/hogan/hello.js
var hogan = require('hogan.js');
var fs = require('fs');
var students = fs.readFileSync('../students.json', 'utf8');
var context = JSON.parse(students);

// Section
var template =
  '{{#students}}' +
  '  <p>Name: {{name}}, Age: {{age}}</p>' +
  '{{/students}}';
template = hogan.compile(template);
console.log(template.render(context));

// Inverted section
template =
  '{{^students}}' +
  '  <p>No students found.</p>' +
  '{{/students}}';
template = hogan.compile(template);

console.log(template.render({students: []}));
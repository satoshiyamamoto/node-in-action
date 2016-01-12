// template/jade/extends.js
var jade = require('jade');
var fs = require('fs');
var pageFile = './views/page.jade';
var page = fs.readFileSync(pageFile);
var context = {
  messages: [
    'You have logged in successfully.',
    'Welcome back!'
  ]
};

var pageFn = jade.compile(page, {filename: pageFile});
console.log(pageFn(context));
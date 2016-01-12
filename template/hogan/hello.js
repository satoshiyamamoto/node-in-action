// template/hogan/hello.js

var hogan = require('hogan.js');
var template = '{{message}}';
var context = {message: 'Hello template!'};

template = hogan.compile(template);
console.log(template.render(context));

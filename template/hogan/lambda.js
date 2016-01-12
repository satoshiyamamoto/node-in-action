// template/hogan/lambda.js
var hogan = require('hogan.js');
var md = require('github-flavored-markdown');

// Lambda (custom functions)
var template =
  '{{#markdown}}' +
  '**Name**: {{name}}' +
  '{{/markdown}}';

var context = {
  name: 'Rick LaRue',
  markdown: function () {
    return function (text) {
      return md.parse(text);
    };
  }
};

template = hogan.compile(template);
console.log(template.render(context));
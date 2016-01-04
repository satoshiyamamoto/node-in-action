var connect = require('connect');
var serveIndex = require('serve-index');

var app = connect()
  .use(serveIndex('public'))
  .listen(3000);
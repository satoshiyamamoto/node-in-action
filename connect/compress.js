var connect = require('connect');
var serveStatic = require('serve-static');
var compression = require('compression');

var app = connect()
  .use(compression())
  .use(serveStatic('public'))
  .listen(3000);
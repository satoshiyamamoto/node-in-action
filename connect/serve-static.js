var connect = require('connect');
var serveStatic = require('serve-static');

connect()
  .use(serveStatic('public')) // basic
  .use('/static', serveStatic('public')) // absolute mount
  .use('/assets', serveStatic(__dirname + '/public')) // relative mount
  .listen(3000);
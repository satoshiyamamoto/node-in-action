var connect = require('connect');
var logger = require('morgan');
var errorhandler = require('errorhandler');

var app = connect()
  .use(logger('dev'))
  .use(function (req, res, next) {
    setTimeout(function onerror() {
      next(new Error('something broke!'));
    }, 500);
  })
  .use(errorhandler())
  .listen(3000);
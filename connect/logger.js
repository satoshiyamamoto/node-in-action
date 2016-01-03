var connect = require('connect');
var morgan = require('morgan');
var app = connect()
  .use(morgan(':method :url :response-time ms'))
  .listen(3000);
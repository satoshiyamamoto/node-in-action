var connect = require('connect');
var morgan = require('morgan');
var app = connect()
  .use(morgan('combined'))
  .listen(3000);
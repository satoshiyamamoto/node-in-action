var connect = require('connect');
var vhost = require('vhost');

var server = connect();

var app1 = require('./sites/expressjs.dev');
server.use(vhost('expressjs.dev', app1));

var app2 = require('./sites/learnboost.dev');
server.use(vhost('learnboost.dev', app2));

server.listen(3000);
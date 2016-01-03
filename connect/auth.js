var connect = require('connect');
var logger = require('./middleware/logger');

function hello(req, res, next) {
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World');
}

function authenticateWithDatabase(user, pass, callback) {
  var err;
  if (user != 'tobi' || pass != 'ferret') {
    err = new Error('Unauthorized');
  }
  callback(err);
}

function restrict(req, res, next) {
  var authorization = req.headers.authorization;
  if (!authorization) return next(new Error('Unauthorized'));

  var parts = authorization.split(' ');
  var schema = parts[0];
  var auth = new Buffer(parts[1], 'base64').toString().split(':');
  var user = auth[0];
  var pass = auth[1];

  authenticateWithDatabase(user, pass, function (err) {
    if (err) throw next(err);
    next();
  });
  next();
}

function admin(req, res, next) {
  switch (req.url) {
    case '/':
      res.end('try /users');
      break;
    case '/users':
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(['tobi', 'loki', 'jane']));
      break;
  }
}

connect()
  .use(logger(':method :url'))
  .use('/admin', restrict)
  .use('/admin', admin)
  .use(hello)
  .listen(3000);
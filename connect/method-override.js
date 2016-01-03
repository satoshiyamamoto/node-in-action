var connect = require('connect');
var bodyParser = require('body-parser');
var logger = require('morgan');
var methodOverride = require('method-override');

function edit(req, res, next) {
  if ('GET' != req.method) return next();
  res.setHeader('Content-Type', 'text/html');
  res.write('<form method="post">');
  res.write('<input type="hidden" name="_method" value="put" />');
  res.write('<input type="text" name="user[name]" value="Tobi" />');
  res.write('<input type="submit" value="Update" />');
  res.write('</form>');
  res.end();
}

function update(req, res, next) {
  if ('PUT' != req.method) return next();
  res.end('Updated name to ' + req.body.user.name);
}

function override(getter) {
  return methodOverride(function(req, res, next) {
    if (req.body && typeof req.body === 'object' && getter in req.body) {
      var method = req.body[getter];
      delete req.body[getter];
      return method;
    }
  });
}

var app = connect()
  .use(logger('dev'))
  .use(bodyParser.urlencoded())
  .use(override('_method'))
  .use(edit)
  .use(update)
  .listen(3000);

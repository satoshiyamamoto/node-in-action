// Limit
var connect = require('connect');
var bodyParser = require('body-parser');
var getRawBody = require('raw-body');
var typer = require('media-typer');

var app = connect()
  .use(function (req, res, next) {
    getRawBody(req, {
      length: req.headers['content-length'],
      limit: '32kb',
      encoding: typer.parse(req.headers['content-type']).parameters.charset
    }, function (err, string) {
      if (err) return next(err);
      req.text = string;
      next();
    });
  })
  .use(bodyParser())
  .listen(3000);


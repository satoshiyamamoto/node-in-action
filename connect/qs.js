var connect = require('connect');
var qs = require('qs');

function query(options) {
  return function query(req, res, next) {
    var query = req.url;
    var pos = query.indexOf('?');
    if (pos == -1) {
      req.query = {};
      next();
    }

    query = query.substr(pos + 1, query.length);
    query = query.match(/([^/?]+)/)[1];
    req.query = qs.parse(query);
    next();
  };
}

var app = connect()
  .use(query())
  .use(function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(req.query));
  });

app.listen(3000);
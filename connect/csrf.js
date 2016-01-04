var connect = require('connect');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var csrf = require('csurf');

connect()
  .use(bodyParser.json())
  .use(bodyParser.urlencoded())
  .use(cookieParser())
  .use(csrf({ cookie: true }))
  .use(function (req, res, next) {
    res.setHeader('Content-Type', 'text/html');
    res.end('csrf token: ' + req.csrfToken());
  })
  .listen(3000);


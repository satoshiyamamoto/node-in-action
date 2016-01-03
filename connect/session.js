var connect = require('connect');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');

var app = connect()
  .use(favicon('./favicon.ico'))
  .use(cookieParser('keyboard cat'))
  .use(cookieSession({
    keys: ['secret1', 'secret2']
  }))
  .use(function (req, res, next) {
    var sess = req.session;
    if (sess.views) {
      sess.views++;
      res.setHeader('Content-Type', 'text/html');
      res.write('<p>views: ' + sess.views + '</p>');
      res.end();
    } else {
      sess.views  = 1;
      res.end('welcome to the session demo. refresh!');
    }
  });

app.listen(3000);
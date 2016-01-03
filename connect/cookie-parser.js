var connect = require('connect');
var cookies = require('cookies');
var cookieParser = require('cookie-parser');

var app = connect()
  .use(cookieParser('tobi is cool ferret'))
  .use(function (req, res) {
    console.log(req.cookies);
    console.log(req.signedCookies);
    res.setHeader('Set-Cookie', 'foo=bar');
    res.end('hello\n');
  }).listen(3000);

// Usage:
// $ curl localhost:3000/ -H 'Cookie: foo=bar'
// $ curl -I localhost:3000/
var connect = require('connect');
var bodyParser = require('body-parser');

var app = connect()
  .use(bodyParser.urlencoded({extended: false}))
  .use(bodyParser.json())
  .use(function (req, res) {
    res.end('Registered new user: ' + req.body.username + '\n');
  })
  .listen(3000);

// Usage:
// $ curl -d 'username=tobi' localhost:3000/
// $ curl -H 'Content-Type: application/json' -d '{"username":"tobi"}' localhost:3000/


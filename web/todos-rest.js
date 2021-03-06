var http = require('http');
var url = require('url');
var _ = require('underscore');
var items = [];

var server = http.createServer(function(req, res) {
  switch (req.method) {
    case 'POST':
      var item = '';
      req.setEncoding('utf8');
      req.on('data', function(chank) {
        item += chank;
      });
      req.on('end', function() {
        items.push(item);
        res.end('OK\n');
      });
      break;
    case 'GET':
      _.each(items, function(item, i) {
        res.write(i + ') ' + item + '\n');
      });
      res.end();
      break;
    case 'PUT':
      var path = url.parse(uri).pathname;
      var i = parseInt(path.slice(1), 10);

      if (isNaN(i)) {
        res.statusCode = 400;
        res.end('Invalid item id\n');
      } else if (!items[i]) {
        res.statusCode = 404;
        res.end('Item not found\n');
      } else {
        var item = '';
        req.on('data', function(chank) {
          item += chank;
        });
        req.on('end', function() {
          items[i] = item;
          res.end('OK\n');
        });
      }
      break;
    case 'DELETE':
      var path = url.parse(uri).pathname;
      var i = parseInt(path.slice(1), 10);

      if (isNaN(i)) {
        res.statusCode = 400;
        res.end('Invalid item id\n');
      } else if (!items[i]) {
        res.statusCode = 404;
        res.end('Item not found\n');
      } else {
        items.splice(i, 1);
        res.end('OK\n');
      }
      break;
    default:
      req.statusCode = 400;
      req.end('Unsupported method');
  }
});

server.listen(3000, function() {
  console.log('Server listening on post 3000...');
});

function getId(uri) {
}

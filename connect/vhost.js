var connect = require('connect');
var vhost = require('vhost');
var fs = require('fs');

var app = connect();

var sites = fs.readdirSync('./sites');

sites.forEach(function (site) {
  console.log(' ... %s', site);
  app.use(vhost(site, require('./sites/' + site)));
});
app.listen(3000);
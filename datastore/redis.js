// datastore/redis.js

var redis = require('redis');
var client = redis.createClient(6379, '127.0.0.1');

client.on('error', function (err) {
  console.log('Error ' + err);
});

// Key-Value (SET / GET)
client.set('color', 'red', redis.print);
client.get('color', function (err, value) {
  if (err) throw err;
  console.log('Get: ' + value);
});

// Hash (HMSET / HGET / HKEYS)
client.hmset('camping', {
  shelter: '2-parson tent',
  cooking: 'campstove'
}, redis.print);
client.hget('camping', 'cooking', function (err, value) {
  if (err) throw err;
  console.log('Will be cooking with: ' + value);
});
client.hkeys('camping', function (err, keys) {
  if (err) throw err;
  keys.forEach(function (key, i) {
    console.log(' ' + key);
  });
});

// List (LPUSH / LRANGE)
client.lpush('tasks', 'Paint the bikeshed red.', redis.print);
client.lpush('tasks', 'Paint the bikeshed green.', redis.print);
client.lrange('tasks', 0, 01, function (err, items) {
  if (err) throw err;
  items.forEach(function (item, i) {
    console.log(' ' + item);
  });
});

// Set (SADD / SMEMBERS)
client.sadd('ip_addresses', '204.10.37.96', redis.print);
client.sadd('ip_addresses', '204.10.37.96', redis.print);
client.sadd('ip_addresses', '72.32.231.8', function (err, members) {
  if (err) throw err;
  console.log(members);
});
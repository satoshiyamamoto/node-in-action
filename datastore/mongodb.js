// datastore/mongodb.js

var mongodb = require('mongodb');
var ObjectID = mongodb.ObjectID;
var server = new mongodb.Server('127.0.0.1', 27017, {});
var client = new mongodb.Db('mydatabase', server, {w: 1});

client.open(function (err) {
  if (err) throw err;
  client.collection('test_insert', function (err, collection) {
    if (err) throw err;
    console.log('We are now able to perform queries.');

    collection.insert({
        'title': 'I like cake',
        'body': 'It is quite good.'
      },
      {safe: true},
      function (err, documents) {
        if (err) throw err;
        console.log('Document ID is: ' + documents.ops[0]._id);
    });

    var _id = new ObjectID('5685dfc4b15f500bcc9db3e0');
    collection.update(
      {_id: _id},
      {$set: {'title': 'I ate too much cake.'}},
      {safe: true},
      function (err) {
        if (err) throw err;
      }
    );
  });
});


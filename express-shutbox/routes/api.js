'use strict';

var auth = require('basic-auth');
var User = require('../lib/user');
var Entry = require('../lib/entry');

exports.auth = function (req, res, next) {
  var credentials = auth(req);
  // id:pass not present
  if (!credentials) return res.send(401);

  User.authenticate(credentials.name, credentials.pass, function (err, user) {
    if (err) return next(err);
    // unauthenticated
    if (!user) return res.send(401);
    // success
    req.remoteUser = user;
    next();
  });
};

exports.user = function (req, res, next) {
  User.get(req.params.id, function (err, user) {
    if (err) return next(err);
    if (!user.id) return res.send(404);
    res.json(user);
  });
};

exports.entries = function (req, res, next) {
  var page = req.page;
  Entry.getRange(page.from, page.to, function (err, entries) {
    if (err) return next(err);

    res.format({
      'application/json': function () {
        res.json(entries);
      },
      'application/xml': function () {
        res.render('entries/xml', { entries: entries });
      }
    });
  });
};
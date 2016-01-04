var Photo = require('../models/Photo');
var path = require('path');
var fs = require('fs');
var join = path.join;

var photos = [];
photos.push({
  name: 'Node.js Logo',
  path: 'https://nodejs.org/static/images/logos/nodejs-green.png'
});
photos.push({
  name: 'Ryan Speakiing',
  path: 'https://nodejs.org/static/legacy/images/ryan-speaker.jpg'
});

exports.list = function (req, res) {
  res.render('photos', {
    title: 'Photos',
    photos: photos
  });
};

exports.form = function (req, res) {
  res.render('photos/upload', {
    title: 'Photo upload'
  });
};

exports.submit = function (dir) {
  return function (req, res, next) {
    var name;
    var path;
    var fstream;

    req.busboy.on('file', function(name, file, filename, encoding, mimetype) {
      path = join(dir, filename);
      fstream = fs.createWriteStream(path);
      file.pipe(fstream);

      file.on('data', function(data) {});
      file.on('end', function() {});
    });

    req.busboy.on('field', function(name, val, fieldnameTruncated, valTruncated) {
      if (name === 'photo[name]') {
        name = val;
      }
    });

    req.busboy.on('finish', function() {
      Photo.create({
        name: name,
        path: path
      }, function (err) {
        if (err) return next(err);

        res.redirect('/photos');
      });
    });
    req.pipe(req.busboy);
  };
};

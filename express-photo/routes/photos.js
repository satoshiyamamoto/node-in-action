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

exports.list = function (req, res, next) {
  Photo.find({}, function (err, photos) {
    if (err) return next(err);
    res.render('photos', {
      title: 'Photos',
      photos: photos
    });
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
    var fname;
    var fstream;

    req.busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
      fname = filename;
      path = join(dir, filename);
      fstream = fs.createWriteStream(path);
      file.pipe(fstream);

      file.on('data', function(data) {});
      file.on('end', function() {});
    });

    req.busboy.on('field', function(key, val, fieldnameTruncated, valTruncated) {
      if (key === 'photo[name]') {
        name = val;
      }
    });

    req.busboy.on('finish', function() {
      Photo.create({
        name: name,
        path: fname
      }, function (err) {
        if (err) return next(err);

        res.redirect('/photos');
      });
    });
    req.pipe(req.busboy);
  };
};

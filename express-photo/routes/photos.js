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

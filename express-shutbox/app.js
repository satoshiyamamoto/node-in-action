// load dependencies
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var user = require('./lib/middleware/user');
var validate = require('./lib/middleware/validate');
var page = require('./lib/middleware/page');
var messages = require('./lib/messages');
var Entry = require('./lib/entry');
var router = require('./routes/index');
var login = require('./routes/login');
var register = require('./routes/register');
var entries = require('./routes/entries');
var api = require('./routes/api');
var app = express();

// environments
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('secret', 'your secret here');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser(app.get('secret')));
app.use(session({
  secret: app.get('secret'),
  resave: false,
  saveUninitialized: true
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api', api.auth);
app.use(user);
app.use(messages);

// routing
app.get('/login', login.form);
app.post('/login', login.submit);
app.get('/logout', login.logout);
app.get('/post', entries.form);
app.post('/post',
  validate.required('entry[title]'),
  validate.lengthAbove('entry[title]', 4),
  entries.submit
);
app.get('/register', register.form);
app.post('/register', register.submit);
app.get('/api/user/:id', api.user);
app.post('/api/entry', entries.submit);
app.get('/api/entries/:page([0-9]+)?', page(Entry.count), api.entries);
app.get('/:page([0-9]+)?', page(Entry.count, 5), entries.list);

// error handler
app.use(router);
app.use(router.notfound);
app.use(router.error);

module.exports = app;

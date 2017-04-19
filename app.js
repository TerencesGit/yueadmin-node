var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var mongoose = require('mongoose');
var dbUrl = 'localhost:27017/yueadmin';
var db = mongoose.connect(dbUrl);

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Authorization, Origin, X-Requested-With");
  res.header("Access-Control-Allow-Methods", "*");
  next();
});
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
var expressSession = require('express-session');
var MongoStore = require('connect-mongo')(expressSession);
app.use(cookieParser());
app.use(expressSession({
  secret: 'yueshi',
  store: new MongoStore({
    url: 'mongodb://localhost',
    //collection: 'sessions'
  }),
  proxy: true,
  resave: true,
  saveUninitialized: true
}))
app.use(express.static(path.join(__dirname, 'public')));
app.locals.moment = require('moment');
app.use(function(req, res, next) {
    var _user = req.session.user;
    app.locals.user = _user;
    next()
});
app.use(function(req, res, next) {
    var _notices = req.session.notices;
    app.locals.notices = _notices;
    next()
});
app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  res.render('404', {title: '页面未找到'})
  //next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.set('showStackError', true)
  app.locals.pretty = true
  mongoose.set('debug',true)
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var stylus = require('stylus');
var _ = require('underscore');
var db = require('./models/index');

var index = require('./routes/index');

var app = express();
var PORT = process.env.PORT || 3000;
var userinfos = [];

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(stylus.middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);

app.get('/download', function(req, res){
  var file = __dirname + '/public/pdf/BUSYALERT USER’S GUIDE.pdf';
  res.download(file); // Set disposition and send it.
});

app.get('/api', function(req, res){
  var query = req.query;
  var allLogs = {}
  var newusers = {}
  var where1 = {
    action: 'NEW_USER'
  }

  db.userinfo.findAll({}).then(function (userinfos){
    allLogs = userinfos;
  }, function (e) {
    res.status(500).send();
  });

  db.userinfo.findAll({where: where1}).then(function (userinfos){
    newusers = userinfos;
  }, function (e) {
    res.status(500).send();
  });

  var currentdate = new Date();
  var diff=30;
  var time = new Date(currentdate.getTime() - diff*60000);
  var day=time.getDate();
  var month=time.getMonth()+1;
  var year=time.getFullYear();
  var time=year + '-' + month + '-' + day;
  var where2 = {
    createdAt: {
      $gte: time
    }
  }

  db.userinfo.findAll({where: where2}).then(function (userinfos){
    res.render('api', { info: allLogs, newusers: newusers, today: userinfos });
  }, function (e) {
    res.status(500).send();
  });

});

// GET /users?userId=
app.get('/users', function(req, res) {
  const actionList = [ 'NEW_USER', 'USER_UNSUBSCRIBED',
                      'USER_LOGGED_IN', 'USER_LOGGED_OUT',
                      'STATUS_BUSY', 'STATUS_AVAILABLE',
                      'FAVOURITE_ADDED', 'FAVOURITE_REMOVED'];
  var query = req.query;
  var wherequery = {};
  if (query.hasOwnProperty('userId') && query.userId.length > 0) {
    wherequery.userId = query.userId;
  }
  if (query.hasOwnProperty('action') && query.action.length > 0
        && actionList.indexOf(query.action) >= 0) {
    wherequery.action = query.action;
  }

  db.userinfo.findAll({where: wherequery}).then(function (userinfos){
    res.render('users', { title: 'Express', user: userinfos, actions: actionList });
  }, function (e) {
    res.status(500).send();
  });
});

app.post('/api', function(req, res){
	db.userinfo.create({
    userId: req.body.userId,
    action: req.body.action,
    extraData: req.body.extraData
  }).then(function (userinfos) {
		res.json(userinfos);
	}, function (e) {
		res.status(400).json(e);
	});
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var stylus = require('stylus');
var _ = require('underscore');
var db = require('./models/index.js');

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

app.get('/userinfos', function(req, res){
  var query = req.query;
  var where = {};

  db.userinfo.findAll({where: where}).then(function (userinfos){
    res.json(userinfos);
  }, function (e) {
    res.status(500).send();
  });
});

app.post('/userinfos', function(req, res){
  var body = _.pick(req.body, 'userId', 'action', 'extraData');

	db.userinfo.create(body).then(function (userinfos) {
		res.json(userinfos.toJSON());
	}, function (e) {
    console.log(req);
		res.status(400).json(e);
	});
})

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

db.sequelize.sync().then(function() {
  app.listen(PORT, function() {
    console.log('Express listenning on port ' + PORT);
  });
});

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var fs = require('fs')
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var map = require('./routes/map');

var app = express();

var accessLogStream = fs.createWriteStream(__dirname + '/access.log', {flags: 'a'})

// setup the logger
var fileLog = morgan('combined', {stream: accessLogStream})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(fileLog);
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req,res, next){
	if(req.headers.host != 'www.skogskartan.nu')
	{
		res.redirect('https://www.skogskartan.nu' + req.url);
		return
	}
	next()
})

app.use('/', routes);
app.use('/', map);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
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

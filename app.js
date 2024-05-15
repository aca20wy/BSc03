var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require("body-parser");


//var addRouter = require('./routes/add');
var usersRouter = require('./routes/users');
var indexRouter = require('./routes/index');
var plantRouter = require('./routes/plant');

//var loginRouter = require('./routes/login');
//var registerRouter = require('./routes/register');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
//app.use(express.json());
//app.use(express.urlencoded({ limit:'10'}));

// Express 3.0
//app.use(express.json({ limit: '10mb' }));
//app.use(express.urlencoded({ limit: '10mb' }));

// Express 4.0
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));



app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
//app.use(bodyParser.urlencoded({ extended: false }));
app.use('/public/images/uploads', express.static(path.join(__dirname, '/public/images/uploads')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
//app.use('/add', addRouter);
app.use('/plant', plantRouter);
//app.use('/login', loginRouter);
//app.use('/register', registerRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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

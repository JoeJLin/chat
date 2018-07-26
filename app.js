var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var socket = require('socket.io');
var session = require('express-session');
require('dotenv').config();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var chatsRouter = require('./routes/chats');

//connect mongoose database
var mongoose = require('mongoose');
mongoose.connect(process.env.DB_PATH);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('we are connected!')
});

var app = express();

app.use(session({
  secret: 'secret-unique-code',
  cookie: { maxAge: 3600000 },
  resave: true,
  saveUninitialized: true
}));

var server = app.listen(3000, function(){
  console.log('listening on port 3000')
})

//setup socket
var io = socket(server);

io.on('connection', function(socket){
  console.log('connected socket');
  // console.log(socket.request)
  console.log(socket.id)

  //handle chat event
  socket.on('chat', function(data){
    io.sockets.emit('chat', data)
    console.log(data);
  });

  socket.on('typing', function(data){
    socket.broadcast.emit('typing', data);
    console.log(data)
  });

})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/chats', chatsRouter);

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

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var socket = require('socket.io');
var session = require('express-session');
const Message = require('./models/message');
require('dotenv').config();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var chatsRouter = require('./routes/chats');

//connect mongoose database
var mongoose = require('mongoose');
mongoose.connect(process.env.DB_PATH, () =>{
  console.log('connected to db');
});

var app = express();

app.use(session({
  secret: 'secret-unique-code',
  cookie: { maxAge: 3600000 },
  resave: true,
  saveUninitialized: true
}));

var server = app.listen(process.env.PORT, function(){
  console.log('listening on port 3000')
})

//setup socket
var io = socket(server);


const onlineUsers = {};
const channels = { General: [] };
io.on('connection', function (socket) {
  require('./sockets/server.js')(io, socket, onlineUsers, channels, Message);
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => { res.locals['socketio'] = io; next(); });

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

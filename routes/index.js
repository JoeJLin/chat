var express = require('express');
var User = require('../models/user');
var router = express.Router();

router.use(function (req, res, next) {
  res.locals.title = "CHAT";
  res.locals.username = req.session.username;
  res.locals.currentUserId = req.session.userId;
  next();
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

//get login page
router.get('/login', (req, res) => {
  res.render('users/login');
});

// POST Login
router.post('/login', (req, res, next) => {
  // const io = res.locals['socketio'];
  // req.body is the body of the login.hbs
  // req.body.username and password must be matched with the names in the login.hbs
  User.authenticate(req.body.username, req.body.password, (err, user) => {
    console.log(req.body)
    // if the user's password or username is incorrect
    if (err || !user) {
      let NextError = new Error('Username or Password incorrect');
      // 401 error is Unauthorized
      NextError.status = 401;

      return next(NextError);
    }
    req.session.userId = user._id;
    req.session.username = user.username;
    // io.on('connection', function (socket) {
    //   require('../sockets/server.js')(io, socket);
    // })
    return res.redirect('/');
  });
});

// logout
router.get('/logout', (req, res, next) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) return next(err);
      return next();
    });
  }
  return res.redirect('/');
});

router.get('/create', function (req, res, next) {
  res.render('users/create');
});

module.exports = router;

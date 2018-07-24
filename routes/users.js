var express = require('express');
var router = express.Router();
const User = require('../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/create', function (req, res, next) {
  res.render('users/create');
});

//create new user
router.post('/', (req, res) => {
  console.log(req.body)
  const user = new User({
    username: req.body.username,
    password: req.body.password,
  });
  user.save(function (err, user) {
    if (err) console.log(err);
    return res.redirect('/');
  });
})

module.exports = router;

var express = require('express');
var router = express.Router();
const User = require('../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/create', function (req, res, next) {
  res.render('create');
});

router.get('/login', (req, res) =>{
  res.render('login');
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
    return res.redirect('./');
  });
})

// router.get('/users/create', (req, res) => {
//   res.render('/create');
// })

module.exports = router;

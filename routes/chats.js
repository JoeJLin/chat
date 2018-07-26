var express = require('express');
var router = express.Router();
// const User = require('../models/user');

router.get('/chat', function (req, res, next) {
    res.render('chats/chat');
});

module.exports = router;
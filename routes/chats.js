var express = require('express');
var router = express.Router();
const User = require('../models/user');
const auth = require('./helpers/auth');

router.get('/', auth.requireLogin, (req, res, next) => {
    User.findById(req.session.userId).populate('friendList').exec((err, user) => {
        if (err) { console.error(err); }
        res.render('chats/', { user });
    })
});

//add user to the friend 
router.get('/add', auth.requireLogin, (req, res) => {
    console.log(req.query.friendName)
    let loggedIn;
    User.findById(req.session.userId).populate('friendList').exec()
        .then((user) => {
            loggedIn = user;
            return User.findOne({username : req.query.friendName})
        })
        .then((friend) => {
            if (friend) {
                // found
                return friend;
            } else {
                // not found 
                throw 'User is not in the system';
            }
        })
        .then((friend) => {
            // console.log('current user !!!!' + loggedIn)
            // console.log('friend user !!!!' + friend)
            if (loggedIn.friendList.findIndex(i => i.username == friend.username) != -1){
                throw 'FRIEND FOUND IN THE LIST';
            } else if (loggedIn.friendList.findIndex(i => i.username == friend.username) == -1) {
                console.log('FRIEND NOT FOUND IN THE LIST');
                return User.findByIdAndUpdate(loggedIn._id, { '$push': { friendList: friend._id } })
            }
        })
        .then(()=>{
            return User.findById(loggedIn._id).populate('friendList').exec()
                .then((user) => {
                    console.log(user)
                    return user;
                });
        })
        .then((data) => {
            res.render('chats/', { user: data });
        })
        .catch((err) =>{
            console.log(err);
            res.render('chats/', { user: loggedIn });
        })    
})

module.exports = router;
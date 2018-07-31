
//check for the existence of a session and a userId
exports.requireLogin = (req, res, next) => {
    if (req.session && req.session.userId) {
        return next();
    } else {
        let err = new Error('You must log in to view this page');
        err.status = 401;
        console.log(err);
        return res.redirect('/');
    }
}
const express = require('express');
const passport = require('passport');

// create route
const router = express.Router();
// Auth with Google
// GET /auth/google
router.get('/google', passport.authenticate('google', {
    scope: ['profile']
}));


// GET /auth/google/callback
router.get('/google/callback', passport.authenticate('google', {
    successRedirect: '/dashboard',
    failureRedirect: '/'
}));

// logout route
router.get('/logout', (req, res) => {
    req.logOut();
    res.redirect('/');
})
module.exports = router;
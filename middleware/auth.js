module.exports = {
    ensreAuth: function (req, res, next) {
        if (req.isAuthenticated()) {
            // dashboard page
            return next();
        } else {
            // login page
            res.redirect('/');
        }
    },

    // if we login we not came back to login page
    ensureGuest: function (req, res, next) {
        if (req.isAuthenticated()) {
            res.redirect('/dashboard');
        } else {
            return next();
        }
    }
}
const express = require('express');
const {
    ensreAuth,
    ensureGuest
} = require('../middleware/auth');
const Story = require('../models/Story');
const moment = require('moment');

// create route
const router = express.Router();
// login
router.get('/', ensureGuest, (req, res) => {
    // res.render('login');
    res.render('login', {
        layout: 'main'
    });
});

// dashboard
router.get('/dashboard', ensreAuth, async (req, res) => {
    // res.render('dashboard');

    // console.log(req.user);

    try {
        const story = await Story.find({
            user: req.user._id
        }).lean();
        console.log(story);



        res.render('dashboard', {
            name: req.user.displayName,
            story: story,
            moment: moment,
            layout: 'layout'
        })
    } catch (error) {
        res.render('error', {
            layout: 'layout'
        });
    }
});

module.exports = router;
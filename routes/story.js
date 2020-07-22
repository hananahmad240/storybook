const express = require('express');
const {
    ensreAuth,
    ensureGuest
} = require('../middleware/auth');
const Story = require('../models/Story');
const moment = require('moment');

// create route
const router = express.Router();


// truncate


router.get('/add', ensreAuth, (req, res) => {
    res.render('addStory', {
        layout: 'layout'

    });
});

router.post('/', ensreAuth, async (req, res) => {
    // saving user in mongoose
    try {
        req.body.user = req.user.id;

        // console.log(req.body);

        const newStory = await Story.create(req.body);
        res.redirect('/dashboard');
    } catch (error) {
        console.log(error);
        res.render('error');
    }

});


router.get('/', ensreAuth, async (req, res) => {
    try {
        let stories = await Story.find({
            status: 'public'
        }).populate({
            path: 'storyBook',
            select: 'displayName'
        }).sort({
            createAt: -1
        }).lean();

        res.render('allStories', {
            layout: 'layout',
            stories,
            truncate: (str) => {
                if (str.length > 30) {
                    let newstr = str.substr(0, 30);
                    newstr = newstr + '.....';
                    return newstr;
                } else {
                    return str;
                }


            },
            stripTag: (input) => {
                return input.replace(/<(?:.|n)*?>/gm, '');
            },
            editIcon: (StoryUserID, loggedUserID, storyId, floating = true) => {
                if (StoryUserID.toString() == loggedUserID.toString()) {
                    if (floating) {
                        return true;
                    } else {
                        return 'match2'
                    }
                } else {
                    return false;
                }
            },
            name: req.user.displayName,
            image: req.user.image,

        });

    } catch (error) {
        console.log(error);
        res.render('error');
    }
})


router.get('/edit/:id', ensreAuth, async (req, res, next) => {
    const story = await Story.findOne({
        _id: req.params.id
    }).lean();

    if (!story) {
        return res.render('error');
    } else {
        if (story.user != req.user.id) {
            res.redirect('/stories');
        } else {
            return res.render('editStory', {
                layout: 'layout',
                story: story
            });
        }
    }


})

router.put('/:id', ensreAuth, async (req, res) => {
    let story = await Story.findById(req.params.id).lean();
    if (!story) {
        return res.render('error');
    } else {
        if (story.user != req.user.id) {
            res.redirect('/dashboard');
        } else {
            story = await Story.findByIdAndUpdate({
                    _id: req.params.id
                },
                req.body, {
                    new: true,
                    runValidators: true
                });
            res.redirect('/dashboard');
        }
    }
})

router.delete('/:id', ensreAuth, async (req, res) => {
    let story = await Story.findById(req.params.id).lean();
    if (!story) {
        return res.render('error');
    } else {
        if (story.user != req.user.id) {
            res.redirect('/dashboard');
        } else {
            story = await Story.findByIdAndRemove({
                _id: req.params.id
            });
            res.redirect('/dashboard');
        }
    }
})


router.get('/:id', ensreAuth, async (req, res) => {
    try {

        const story = await Story.findOne({
                _id: req.params.id
            }).populate('storyBook')
            .lean();

        if (!story) {
            return res.render('error');
        } else {
            if (story.user != req.user.id) {
                res.redirect('/stories');
            } else {
                return res.render('seeStory', {
                    layout: 'layout',
                    moment,
                    story: story,
                    user: req.user,
                    truncate: (str) => {
                        if (str.length > 30) {
                            let newstr = str.substr(0, 30);
                            newstr = newstr + '.....';
                            return newstr;
                        } else {
                            return str;
                        }


                    },
                    stripTag: (input) => {
                        return input.replace(/<(?:.|n)*?>/gm, '');
                    },
                });
            }
        }

    } catch (error) {
        console.log(error);
        return res.render('error');
    }
})
module.exports = router;
const mongoose = require('mongoose');
const StorySchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: true
    },

    body: {
        type: String,
        required: true
    },

    status: {
        type: String,
        enum: ['public', 'private'],
        default: 'public'
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'storyBook'
    },
    createAt: {
        type: Date,
        default: Date.now()
    }
});
const Story = mongoose.model('story', StorySchema, 'story');

module.exports = Story;
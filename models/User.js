const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    GoogleId: {
        type: String,
        required: true
    },

    displayName: {
        type: String,
        required: true
    },

    firstName: {
        type: String,
        required: true
    },

    lastName: {
        type: String,
        required: true
    },

    image: {
        type: String,
        // required:true
    },
    createAt: {
        type: Date,
        default: Date.now()
    }
});

const User = mongoose.model('storyBook', UserSchema, 'storyBook');

module.exports = User;
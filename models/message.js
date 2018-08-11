const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    channel: { 
        type: String, 
        required: true,
        unique: true, 
    },
    memberCount: {
        type: Number,
        default: 0,
    },
    description: {
        type: String,
        required: true,
    },
    limit: {
        type: Number,
        default: 100,
    },
    permission: {
        type: String,
    },
    Owner: {
        type: String,
        required: true,
    },
    invitation: [{
        username: {
            type: String,
        }
    }],
    conversation: [{
        author: {
            type: String,
        },
        message: {
            type: String,
        },
        time: {
            type: String
        }
    }]
});

module.exports = mongoose.model('Message', MessageSchema);
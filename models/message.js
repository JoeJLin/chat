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
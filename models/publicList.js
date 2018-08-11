const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PublicListSchema = new Schema({
    publicList: [{
        channel: {
            type: String,
        },
    }]
})

module.exports = mongoose.model('PublicList', PublicListSchema);
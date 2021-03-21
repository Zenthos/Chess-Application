const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        default: function () { return new mongoose.Types.ObjectId }
    }, 
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    username: { type: String, required: true },
    body: { type: String, required: true }, 
    date: { type: Date, default: Date.now }
})

const ThreadSchema = new mongoose.Schema({
    title: {type: String, required: true },
    comments: [CommentSchema],
    date: { type: Date, default: Date.now },
});

const Thread = mongoose.model('Thread', ThreadSchema, 'threads');

module.exports = Thread;
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Comment = new Schema(
    {
        post_id: {
            type: String,
            ref: 'posts',
            required: true,
        },
        user_id: { type: String, required: true },
        comment: { type: String, required: true },
        reply_to_comment_id: {
            type: mongoose.Schema.ObjectId,
            ref: 'comments',
        },
    },
    {
        timestamps: { createdAt: 'comment_time' }
    }
)

module.exports = mongoose.model('comments', Comment)
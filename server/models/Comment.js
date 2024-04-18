const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Comment = new Schema(
    {
        comment: { type: String, required: true },
        likes_count: { type: Number, default: 0 },
        post_id: { type: String, ref: 'posts', required: true },
        user_id: { type: String, required: true },
        parent_id: { type: mongoose.Schema.ObjectId, ref: 'comments' },
    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model('comments', Comment)
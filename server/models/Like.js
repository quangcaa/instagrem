const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Like = new Schema(
    {
        post_id: { type: String, ref: 'Post'},
        comment_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment'},
        user_id: { type: String, required: true },
    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model('likes', Like)
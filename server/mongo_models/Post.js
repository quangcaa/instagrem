const mongoose = require('mongoose')
const Schema = mongoose.Schema
const AutoIncrement = require('mongoose-sequence')(mongoose)

const Post = new Schema(
    {
        user_id: { type: Number },
        caption: { type: String },
        likes_count: { type: Number, default: 0 },
        comments_count: { type: Number, default: 0 },
        media_url: [{ type: String }],
        hashtags: [{ type: String, ref: 'hashtags' }],
        mentions: [{ type: String }],
        status: { type: String, enum: ['POSTED', 'ARCHIVED', 'DELETED'], default: 'POSTED' },
    },
    {
        _id: false,
        timestamps: true,
    }
)

// add plugin
Post.plugin(AutoIncrement)

module.exports = mongoose.model('posts', Post)
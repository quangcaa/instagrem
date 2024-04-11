const mongoose = require('mongoose')
const Schema = mongoose.Schema
const AutoIncrement = require('mongoose-sequence')(mongoose)

// Like Schema
const Like = new Schema(
    {
        post_id: {
            type: mongoose.Schema.ObjectId,
            ref: 'posts',
            required: true,
        },
        user_id: { type: String, required: true },
    },
    {
        timestamps: { createdAt: 'like_time' }
    }
)

// Comment Schema
const Comment = new Schema(
    {
        post_id: {
            type: mongoose.Schema.ObjectId,
            ref: 'posts',
            required: true,
        },
        user_id: { type: String, required: true },
        comment: { type: String, required: true },
        media_url: { type: String },
        reply_to_comment_id: {
            type: mongoose.Schema.ObjectId,
            ref: 'comments',
        },
    },
    {
        timestamps: { createdAt: 'comment_time' }
    }
)

// Post Schema
const Post = new Schema(
    {
        user_id: { type: Number},
        caption: { type: String, required: true },
        post_type: { type: String, enum: ['TEXT', 'MEDIA'], default: 'TEXT'},
        likes_count: { type: Number, default: 0 },
        comments_count: { type: Number, default: 0 },
        media_url: [{ type: String }],
        hashtags: [{ type: String }],
        mentions: [{ type: String }],
        status: { type: String, enum: ['POSTED', 'ARCHIVED', 'DELETED'], default: 'POSTED'},
    },
    {
        _id: false,
        timestamps: true,
    }
)

// add plugin
Post.plugin(AutoIncrement)

module.exports = mongoose.model('likes', Like)
module.exports = mongoose.model('comments', Comment)
module.exports = mongoose.model('posts', Post)


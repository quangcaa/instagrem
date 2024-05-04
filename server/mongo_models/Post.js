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
        hashtags: [{ type: mongoose.Schema.ObjectId, ref: 'hashtags' }],
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

// Define a virtual field to calculate the likes count from the 'like' collection
Post.virtual('likes', {
    ref: 'likes',
    localField: '_id',
    foreignField: 'post_id',
    count: true,
})

// Update the 'likes_count' default value to use the virtual field
Post.path('likes_count').default(function () {
    return this.likes || 0
})

module.exports = mongoose.model('posts', Post)

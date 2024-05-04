const mongoose = require('mongoose')
const Schema = mongoose.Schema

const { v4: uuidv4 } = require('uuid')

const Like = new Schema(
    {
        _id: { type: String, default: uuidv4 },
        post_id: { type: Number, ref: 'posts' },
        user_id: { type: String, required: true },
    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model('likes', Like)
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const { v4: uuidv4 } = require('uuid')

const Comment = new Schema(
    {
        _id: { type: String, default: uuidv4 },
        comment: { type: String, required: true },
        post_id: { type: String, ref: 'posts', required: true },
        user_id: { type: String, required: true },
    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model('comments', Comment)

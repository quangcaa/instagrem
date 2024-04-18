const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Message = new Schema(
    {
        conversation_id: { type: mongoose.Schema.ObjectId, ref: 'conversations', required: true, },
        sender_id: { type: Number, required: true },
        receiver_id: { type: Number, required: true },
        message: { type: String, required: true },
        reply_story_id: { type: mongoose.Schema.ObjectId, ref: 'stories', default: null }
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('messages', Message)


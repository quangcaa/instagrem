const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Conversation = new Schema(
    {
        participants: [{ type: String }],
        lastMessage_id: { type: mongoose.Schema.ObjectId, ref: 'messages' }
    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model('conversations', Conversation)
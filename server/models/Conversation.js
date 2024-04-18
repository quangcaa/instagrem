const mongoose = require('mongoose')
const Schema = mongoose.Schema
const AutoIncrement = require('mongoose-sequence')(mongoose)

const Conversation = new Schema(
    {
        participants: [{ type: Number }],
        lastMessage_id: { type: mongoose.Schema.ObjectId, ref: 'messages' }
    },
    {
        _id: false,
        timestamps: true,
    }
)

// add plugin
Conversation.plugin(AutoIncrement)

module.exports = mongoose.model('conversations', Conversation)


const mongoose = require('mongoose')
const Schema = mongoose.Schema
const AutoIncrement = require('mongoose-sequence')(mongoose)

const Conversation = new Schema(
    {
        conversation_id: { type: Number, unique: true },
        participants: [{ type: String }],
        lastMessage_id: { type: mongoose.Schema.ObjectId, ref: 'messages' }
    },
    {
        timestamps: true,
    }
)

// add plugin
Conversation.plugin(AutoIncrement, { id: 'conversation_id_counter', inc_field: 'conversation_id' })

module.exports = mongoose.model('conversations', Conversation)
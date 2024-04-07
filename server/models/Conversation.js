const mongoose = require('mongoose')
const Schema = mongoose.Schema
const AutoIncrement = require('mongoose-sequence')
const { v4: uuidv4 } = require('uuid')

const Conversation = new Schema(
    {
        last_message_sender_id: {},
        last_message: {},
    },
    {
        _id: false,
        timestamps: true,
    }
)

const Message = new Schema(
    {
        _id: { type: String, default: uuidv4 },
        convo_id: {
            type: mongoose.Types.ObjectId,
            ref: 'conversations',
            required: true,
        },
        sender_id: { type: String, required: true },
        receiver_id: { type: String, required: true },
        message: { type: String, required: true },
        seen: { type: Boolean, default: false },
        reply_story_id: {
            type: mongoose.Types.ObjectId,
            ref: 'stories',
        }
    },
    {
        timestamps: { createdAt: 'sent_at' }
    }
)

const Story = new Schema(
    {
        _id: { type: String, default: uuidv4 },
        user_id: { type: String, required: true },
        media_url: { type: String, required: true },
        status: { type: String, enum: ['POSTED', 'DELETED', 'ARCHIVED'] }
    },
    {
        timestamps: { createdAt: 'posted_at' }
    }
)

// add plugin
Conversation.plugin(AutoIncrement)

module.exports = mongoose.model('conversations', Conversation)
module.exports = mongoose.model('messages', Message)
module.exports = mongoose.model('stories', Story)


const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Message = new Schema(
    {
        conversation_id: { type: mongoose.Schema.Types.ObjectId, ref: 'conversations' },
        sender_id: { type: String, required: true },
        receiver_id: { type: String, required: true },
        text: { type: String, required: true },
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('messages', Message)

 
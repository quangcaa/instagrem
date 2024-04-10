const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { v4: uuidv4 } = require('uuid')

const Story = new Schema(
    {
        _id: { type: String, default: uuidv4 },
        user_id: { type: String, required: true },
        media_url: { type: String, required: true },
        status: { type: String, enum: ['POSTED', 'DELETED', 'ARCHIVED'] },
        expiration: { type: Date, default: Date.now() + 24 * 60 * 60 * 1000 } 
    },
    {
        timestamps: true,
    }
)

// Index the expiration field for automatic expiration
Story.index({ expiration: 1 }, { expireAfterSeconds: 0 }) 

module.exports = mongoose.model('stories', Story)

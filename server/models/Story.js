const mongoose = require('mongoose')
const Schema = mongoose.Schema
const AutoIncrement = require('mongoose-sequence')(mongoose)

const Story = new Schema(
    {
        user_id: { type: String, required: true },
        media_url: { type: String, required: true },
        expiration: { type: Date, default: Date.now() + 24 * 60 * 60 * 1000, expires: 24 * 60 * 60 }
    },
    {
        timestamps: true,
    }
)

// add plugin
Story.plugin(AutoIncrement)

module.exports = mongoose.model('stories', Story)

const mongoose = require('mongoose')
require('dotenv').config()

const mongoUri = `mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@${process.env.MONGO_DB_USERNAME}.9ftudqn.mongodb.net/instagrem?retryWrites=true&w=majority&appName=${process.env.MONGO_DB_USERNAME}`

async function connect() {
    try {
        mongoose.set('strictQuery', false)
        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB database ...')
    } catch (error) {
        console.log(`Error connecting to MongoDB:\n${error.message}`)
    }
}

module.exports = { connect };

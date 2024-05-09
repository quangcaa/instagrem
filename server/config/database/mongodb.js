const mongoose = require('mongoose')
const { loggerMONGO } = require('../../utils/winston')
require('dotenv').config()

mongoose.set('debug', (collectionName, method, query, doc) => {
  loggerMONGO.info(`Mongoose: ${collectionName}.${method}`, { query, doc })
})

const mongoUri = `mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@${process.env.MONGO_DB_USERNAME}.9ftudqn.mongodb.net/${process.env.MONGO_DB_DATABASE}?retryWrites=true&w=majority&appName=${process.env.MONGO_DB_USERNAME}`

async function connect() {
  try {
    mongoose.set('strictQuery', false)
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log('Connected to MongoDB database ...')
  } catch (error) {
    console.log(`Error connecting to MongoDB:\n${error.message}`)
  }
}

module.exports = { connect }

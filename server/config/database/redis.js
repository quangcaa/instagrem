const redis = require('redis')
require('dotenv').config()

const client = redis.createClient({
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
    }
})

client.connect()

client.on('connect', async function () {
    console.log('Connected to Redis Server ...')
})

module.exports = { client }
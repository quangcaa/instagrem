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
client.on('error', function (err) {
    console.error('Error connecting to Redis', err)
})
client.on('connect', async function () {
    console.log('Connected to Redis Server ...')
})


const subClient = redis.createClient({
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
    }
})
subClient.connect()
subClient.on('error', function (err) {
    console.error('Error connecting to Sub Redis', err)
})
subClient.on('connect', async function () {
    console.log('Connected to Sub Redis Server ...')
})


const pubClient = redis.createClient({
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
    }
})
pubClient.connect()
pubClient.on('error', function (err) {
    console.error('Error connecting to Pub Redis', err)
})
pubClient.on('connect', async function () {
    console.log('Connected to Pub Redis Server ...')
})
module.exports = { client, subClient, pubClient }
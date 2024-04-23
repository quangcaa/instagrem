const redis = require('redis')

const client = redis.createClient({
    password: 'GEawwr0L5fo2PAZShkvPH7vE15o8532I',
    socket: {
        host: 'redis-18451.c8.us-east-1-3.ec2.redns.redis-cloud.com',
        port: 18451
    }
})

client.connect()

client.on('connect', async function () {
    console.log('Connected!')
})


module.exports = { client }


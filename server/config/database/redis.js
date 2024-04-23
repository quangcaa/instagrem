const redis = require('redis');
require('dotenv').config();

const createClient = () => {
    const client = redis.createClient({
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        password: process.env.REDIS_PASSWORD
    });

    client.on('error', (err) => {
        console.log('Redis Client Error', err);
    });

    return client;
};

module.exports = createClient();

const mysql = require('mysql2')
require('dotenv').config()

const mysql_connect = mysql.createPool({
    host: process.env.MYSQL_DB_HOST,
    user: process.env.MYSQL_DB_USER,
    password: process.env.MYSQL_DB_PASSWORD,
    database: process.env.MYSQL_DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 20,
    maxIdle: 20, // max idle connections, the default value is the same as `connectionLimit`
    idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
})

module.exports = mysql_connect
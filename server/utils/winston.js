const winston = require('winston')

const loggerMYSQL = winston.createLogger({
    level: 'debug',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: 'D:\\logger\\mysql-combined.log' })
    ]
})

const loggerMONGO = winston.createLogger({
    level: 'debug',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: 'D:\\logger\\mongo-combined.log' })
    ]
})

module.exports = { loggerMONGO, loggerMYSQL }
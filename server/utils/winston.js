const winston = require('winston')
const DailyRotateFile = require('winston-daily-rotate-file')

const loggerMYSQL = winston.createLogger({
    level: 'debug',
    format: winston.format.json(),
    transports: [
        new DailyRotateFile({
            filename: 'D:\\logger\\mysql-%DATE%-combined.log',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: false,
            maxSize: '50m',
            maxFiles: '1d',
            frequency: '5m'
        })
    ]
})

const loggerMONGO = winston.createLogger({
    level: 'debug',
    format: winston.format.json(),
    transports: [
        new DailyRotateFile({
            filename: 'D:\\logger\\mongo-%DATE%-combined.log',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: false,
            maxSize: '50m',
            maxFiles: '1d',
            frequency: '5m'
        })
    ]
})

module.exports = { loggerMONGO, loggerMYSQL }
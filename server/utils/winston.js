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
            maxFiles: '14d',
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
            maxFiles: '14d',
        })
    ]
})

module.exports = { loggerMONGO, loggerMYSQL }
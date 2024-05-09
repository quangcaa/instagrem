const { app } = require("./socket/socket.js")
const { server } = require("./socket/socket.js")
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const path = require('path')
const startBackup = require('./utils/cron')

const route = require('./routes')
const mongodb_con = require('./config/database/mongodb')
const { sync } = require('./config/database/sync')
const rateLimit = require('./middlewares/rateLimit')

require('dotenv').config()

const PORT = process.env.PORT

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors({
    // origin: `${process.env.WEB_URL}`,
    origin: 'http://localhost:3000',
    credentials: true,
}))
app.use(cookieParser())
app.use('/', rateLimit)

// Connect to db
// mongodb_con.connect()
sync()

// Backup database
startBackup()

// Static files (public)
app.use(express.static(path.join(__dirname, 'public')))

// Routes init
route(app)

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})
const express = require('express')
const cors = require('cors')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const { Server } = require("socket.io")
const path = require('path')
const startBackup = require('./backup/cron')

const route = require('./routes')
const mongodb_con = require('./config/database/mongodb')

require('dotenv').config()

const app = express()
const PORT = process.env.PORT


app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())
app.use(cookieParser())

app.use((req, res, next) => {
    // console.log(req.session)
    // console.log(req.user)
    next()
})

// Connect to db
mongodb_con.connect()

// Backup database
startBackup()

// Static files (public)
app.use(express.static(path.join(__dirname, 'public')))

// Routes init
route(app)

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})

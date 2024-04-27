const express = require('express')
const cors = require('cors')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const { Server } = require("socket.io")
const path = require('path')

const route = require('./routes')
const mongodb_con = require('./config/database/mongodb')

require('dotenv').config()

const app = express()
const PORT = process.env.PORT

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors({
    origin: 'http://localhost:3000', // Allow requests from this origin
    credentials: true 
}))
app.use(cookieParser())

// Connect to db
mongodb_con.connect()

// Static files (public)
app.use(express.static(path.join(__dirname, 'public')))

// Routes init
route(app)

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})
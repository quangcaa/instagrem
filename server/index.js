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
app.use(cors())
app.use(cookieParser())

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000'); // Replace with your frontend origin
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true); // Allow requests with credentials
    next();
});

app.use((req, res, next) => {
    // console.log(req.session)
    // console.log(req.user)
    next()
})

// Connect to db
mongodb_con.connect()

// Static files (public)
app.use(express.static(path.join(__dirname, 'public')))

// Routes init
route(app)

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})

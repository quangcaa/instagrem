const express = require('express')
const cors = require('cors')
const path = require('path')
const route = require('./routes')
const mongodb_con = require('./config/db/mongodb')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Connect to db
mongodb_con.connect()

// Static files (public)
app.use(express.static(path.join(__dirname, 'public')))

// Routes init
route(app)

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`)
})

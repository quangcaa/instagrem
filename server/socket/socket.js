const {Server} = require('socket.io')
const http = require('http')
const express = require('express')
require('dotenv').config()


const app = express()
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        // origin: `${process.env.WEB_URL}`,
        origin:"http://localhost:3000",
        methods:["GET","POST"]
    }
})

const getRecipientSocketId = (receiver_id) => {
	return userSocketMap[receiver_id]
}


const userSocketMap = {} // userId: socketId
io.on('connection', (socket) => {
    console.log("user connected", socket.id)

    const userId = socket.handshake.query.userId
    if (userId != "undefined") userSocketMap[userId] = socket.id
    io.emit("getOnlineUsers", Object.keys(userSocketMap))

    socket.on("disconnect" ,() => {
        console.log("user disconnected")
        delete userSocketMap[userId]
        io.emit("getOnlineUsers", Object.keys(userSocketMap))
    }) 

    
})

module.exports = { io, app, server, getRecipientSocketId }
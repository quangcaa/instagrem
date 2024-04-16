const jwt = require('jsonwebtoken')
const mysql_con = require('../config/db/mysql')
require('dotenv').config()

const requireAuth = async (req, res, next) => {
    try {
        const token = req.cookies.jwt
        if (!token) {
            return res.status(401).json({ success: false, message: 'Unauthorized - No Token Found' })
        }

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        if (!decoded) {
            return res.status(401).json({ success: false, message: 'Unauthorized - Invalid Token' })
        }

        const [user] = await mysql_con.promise().query('SELECT user_id, username, email, full_name, bio, profile_image_url FROM users WHERE user_id = ?', [decoded.userId])
        if(!user) {
            return res.status(404).json({ success: false, message: 'User not found' })
        }
        
        req.userId = user[0].user_id 

        next()
    } catch (error) {
        console.log(error)
        return res.status(403).json({ success: false, message: 'Invalid token' })
    }
}

const optionalAuth = (req, res, next) => {
    const authorizationHeader = req.header('Authorization');
    const token = authorizationHeader && authorizationHeader.split(' ')[1]

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
            req.userId = decoded.userId;

        } catch (error) {
            console.log(error)
            return res.status(403).json({ success: false, message: 'Invalid token' })
        }
    }

    next()
}


module.exports = { requireAuth }
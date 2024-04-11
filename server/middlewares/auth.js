const jwt = require('jsonwebtoken')
require('dotenv').config()

const requireAuth = (req, res, next) => {
    const authorizationHeader = req.header('Authorization')
    const token = authorizationHeader && authorizationHeader.split(' ')[1]

    if (!token) {
        return res.status(401).json({ success: false, message: 'Access token not found' })
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        req.userId = decoded.userId
        console.log()

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


module.exports = { requireAuth, optionalAuth }
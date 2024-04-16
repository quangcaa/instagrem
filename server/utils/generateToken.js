const jwt = require('jsonwebtoken')
require('dotenv').config()

const generateTokenAndSetCookie = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '15d'
    })

    console.log('Generated token:', token)

    res.cookie('jwt', token, {
        maxAge: 15 * 24 * 60 * 60 * 1000, // MS
        httpOnly: true, // prevent XSS attacks 
        sameSite: 'strict' // CSRK attacks cross-site 
    })
}

module.exports = generateTokenAndSetCookie
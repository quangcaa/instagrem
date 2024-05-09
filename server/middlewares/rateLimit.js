const rateLimit = require('express-rate-limit')

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 15 minutes
    limit: 1000, // Limit each IP to 5000 requests per `window` (here, per 15 minutes).
    legacyHeaders: false,
    message: 'Too many requests' // Disable the `X-RateLimit-*` headers. 
})

module.exports = limiter
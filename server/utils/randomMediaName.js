const crypto = require('crypto-js')

const randomMediaName = (bytes = 32) => {
    return crypto.lib.WordArray.random(bytes).toString()
}

module.exports = { randomMediaName }
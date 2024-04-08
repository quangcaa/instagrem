const postRouter = require('./post')
const authRouter = require('./auth')
const profileRouter = require('./profile')

function route(app) {
    app.use('/auth', authRouter)
    app.use('/post', postRouter)
    app.use('/', profileRouter)
}

module.exports = route

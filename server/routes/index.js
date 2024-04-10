const authRouter = require('./auth')
const userRouter = require('./user')
const postRouter = require('./post')
const profileRouter = require('./profile')

function route(app) {
    app.use('/auth', authRouter)
    app.use('/user', userRouter)
    app.use('/post', postRouter)
    app.use('/', profileRouter)
}

module.exports = route

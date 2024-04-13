const authRouter = require('./auth')
const userRouter = require('./user')
const postRouter = require('./post')
const accountRouter = require('./account')

function route(app) {
    app.use('/auth', authRouter)
    app.use('/user', userRouter)
    app.use('/post', postRouter)
    app.use('/account', accountRouter)
}

module.exports = route

const authRouter = require('./auth')
const userRouter = require('./user')
const postRouter = require('./post')
const accountRouter = require('./account')
const searchRouter = require('./search')


function route(app) {
    app.use('/auth', authRouter)
    app.use('/user', userRouter)
    app.use('/post', postRouter)
    app.use('/account', accountRouter)
    app.use('/search', searchRouter)
}

module.exports = route

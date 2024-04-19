const authRouter = require('./auth')
const userRouter = require('./user')
const postRouter = require('./post')
const accountRouter = require('./account')
const searchRouter = require('./search')
const activityRouter = require('./activity')
const likeRouter = require('./like')
const commentRouter = require('./comment')


function route(app) {
    app.use('/auth', authRouter)
    app.use('/user', userRouter)
    app.use('/post', postRouter)
    app.use('/account', accountRouter)
    app.use('/search', searchRouter)
    app.use('/activity', activityRouter)
    app.use('/like', likeRouter)
    app.use('/comment', commentRouter)
}

module.exports = route

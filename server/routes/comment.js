const express = require('express')
const router = express.Router()

const { requireAuth } = require('../middlewares/auth')

const commentController = require('../controllers/CommentController')

router.post('/p/:post_id', requireAuth, commentController.createComment)
router.post('/c/:parent_id', requireAuth, commentController.createCommentReply)

router.get('/c/:parent_id/reply/:offset', requireAuth, commentController.retrieveCommentReplies)

router.delete('/:comment_id', requireAuth, commentController.deleteComment)

module.exports = router

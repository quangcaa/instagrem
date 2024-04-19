const express = require('express')
const router = express.Router()

const { requireAuth } = require('../middlewares/auth')

const commentController = require('../controllers/CommentController')

router.post('/p/:post_id', requireAuth, commentController.createComment)
router.delete('', requireAuth, commentController.deleteComment)

module.exports = router

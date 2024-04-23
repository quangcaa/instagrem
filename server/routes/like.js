const express = require('express')
const router = express.Router()

const { requireAuth } = require('../middlewares/auth')

const likeController = require('../controllers/LikeController')

router.post('/p/:post_id', requireAuth, likeController.likePost)
router.post('/c/:comment_id', requireAuth, likeController.likeComment)

module.exports = router

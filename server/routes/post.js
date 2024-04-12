const express = require('express')
const router = express.Router()

const { requireAuth, optionalAuth } = require('../middlewares/auth')
const postController = require('../controllers/PostController')

router.get('/feed', requireAuth, postController.retrieveFeed)

router.get('/:post_id', postController.retrievePost)
router.get('/explore/:hashtag', optionalAuth, postController.retrieveHashtagPost)
router.post('/:post_id/like', requireAuth, postController.likePost)

router.post('/create', requireAuth, postController.createPost)
router.put('/:id', requireAuth, postController.updatePost)
router.delete('/:id', requireAuth, postController.deletePost)
router.get('/', requireAuth, postController.getPost)

module.exports = router

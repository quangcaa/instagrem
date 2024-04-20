const express = require('express')
const router = express.Router()

const { requireAuth } = require('../middlewares/auth')
const upload = require('../middlewares/multer')
const postLimit = require('../middlewares/rateLimit')

const postController = require('../controllers/PostController')

router.get('/feed', requireAuth, postController.retrieveFeed)

router.get('/:post_id', postController.retrievePost)
router.get('/explore/:hashtag', requireAuth, postController.retrieveHashtagPost)

router.post('/create', postLimit, requireAuth, upload.fields([{ name: 'image', maxCount: 5 }, { name: 'video', maxCount: 1 }]), postController.createPost)
router.put('/:id', requireAuth, postController.updatePost)
router.delete('/:id', requireAuth, postController.deletePost)

module.exports = router

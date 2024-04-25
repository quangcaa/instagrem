const express = require('express')
const router = express.Router()

const { requireAuth } = require('../middlewares/auth')
const upload = require('../middlewares/multer')
const postLimit = require('../middlewares/rateLimit')

const postController = require('../controllers/PostController')

router.get('/following/:offset', requireAuth, postController.retrieveFollowingFeed)
router.get('/explore/:hashtag', requireAuth, postController.retrieveHashtagPost)

router.get('/:post_id', postController.retrievePost)
router.get('/u/:username', postController.retrieveUserPosts)

router.post('/create', postLimit, requireAuth, upload.fields([{ name: 'image', maxCount: 5 }, { name: 'video', maxCount: 1 }]), postController.createPost)
router.put('/:post_id', requireAuth, postController.updatePost)
router.delete('/:post_id', requireAuth, postController.deletePost)

module.exports = router

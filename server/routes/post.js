const express = require('express')
const router = express.Router()

const { requireAuth } = require('../middlewares/auth')
const postController = require('../controllers/PostController')

router.post('/create', requireAuth, postController.createPost)
router.put('/:id', requireAuth, postController.updatePost)
router.delete('/:id', requireAuth, postController.deletePost)
router.get('/', requireAuth, postController.getPost)

module.exports = router

const express = require('express')
const router = express.Router()

const verifyToken = require('../middlewares/auth')
const postController = require('../controllers/PostController')

router.post('/create', verifyToken, postController.createPost)
router.put('/:id', verifyToken, postController.updatePost)
router.delete('/:id', verifyToken, postController.deletePost)
router.get('/', verifyToken, postController.getPost)

module.exports = router

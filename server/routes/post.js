const express = require('express')
const router = express.Router()

const postController = require('../controllers/PostController')

router.post('/create', postController.createPost)
router.get('/', postController.showPost)

module.exports = router

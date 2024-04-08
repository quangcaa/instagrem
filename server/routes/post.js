const express = require('express')
const router = express.Router()

const Post = require('../models/Post')

// [POST] /posts/create
// create post
// Private
router.post('/create', async (req, res) => {
    const { user_id, caption, post_type } = req.body

    try {
        const newPost = new Post({ user_id, caption, post_type })

        await newPost.save()

        res.json({ success: true, message: 'Created post !' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
})

module.exports = router

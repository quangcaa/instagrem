const Post = require('../models/Post')

class PostController {
    // [POST] /posts/create
    // create post
    // Private
    createPost(req, res, next) {
        const newPost = new Post(req.body)
        newPost
            .save()
            .then(() =>
                res.json({ success: true, message: 'Created post !' })
                // res.redirect('back')
            )
            .catch(next)

        // try {
        //     const newPost = new Post({ user_id, caption, post_type })

        //     await newPost.save()

        //     res.json({ success: true, message: 'Created post !' })
        // } catch (error) {
        //     console.log(error)
        //     res.status(500).json({ success: false, message: 'Internal server error' })
        // }
    }

    // [POST] /posts/
    // Show post
    // Public
    showPost(req, res, next) {
        Post.find()
            .then((posts) =>
                res.json(posts)
            )
            .catch(next)
    }
}

module.exports = new PostController();

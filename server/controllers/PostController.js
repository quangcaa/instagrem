const Post = require('../models/Post')

class PostController {

    // @route [POST] /post/create
    // @desc create post
    // @access Private
    async createPost(req, res) {
        const { caption, media_url, hashtags, mentions } = req.body

        // check if caption is provided
        if (!caption) {
            return res.status(400).json({ success: false, message: 'Missing caption' })
        }

        // create post
        try {
            const newPost = new Post({
                caption,
                media_url,
                hashtags,
                mentions,
                user_id: req.userId,
            })

            await newPost.save()

            res.json({ success: true, message: 'Created post !', post: newPost })
        } catch (error) {
            console.log(error)
            res.status(500).json({ success: false, message: 'Internal server error' })
        }
    }

    // @route [PUT] /post/:id
    // @desc update post
    // @access Private
    async updatePost(req, res) {
        const { caption, media_url, hashtags, mentions } = req.body

        // check if caption is provided
        if (!caption) {
            return res.status(400).json({ success: false, message: 'Missing caption' })
        }

        // update post
        try {
            let updatedPost = {
                caption: caption || '',
                media_url: media_url || [],
                hashtags: hashtags || [],
                mentions: mentions || [],
            }

            const postUpdateCondition = { _id: req.params.id, user_id: req.userId }

            updatedPost = await Post.findOneAndUpdate(postUpdateCondition, updatedPost, { new: true })

            // user not authorised
            if (!updatedPost) {
                return res.status(401).json({ success: false, message: 'Post not found or user not authorised' })
            }

            res.json({ success: true, message: 'Updated post !', post: updatedPost })

        } catch (error) {
            console.log(error)
            res.status(500).json({ success: false, message: 'Internal server error' })
        }
    }

    // @route [DELETE] /post/:id
    // @desc delete post
    // @access Private
    async deletePost(req, res) {
        // delete post
        try {
            const postDeleteCondition = { _id: req.params.id, user_id: req.userId }
            const deletedPost = await Post.findOneAndDelete(postDeleteCondition)

            // user not authorised 
            if (!deletedPost) {
                return res.status(401).json({ success: false, message: 'Post not found or user not authorised' })
            }

            res.json({ success: true, message: 'Deleted post !', post: deletedPost })
        } catch (error) {
            console.log(error)
            res.status(500).json({ success: false, message: 'Internal server error' })
        }
    }

    // @route [GET] /post
    // @desc get posts
    // @access Private
    async getPost(req, res) {
        try {
            const posts = await Post.find({ user_id: req.userId })

            res.json({ success: true, posts })
        } catch (error) {
            console.log(error)
            res.status(500).json({ success: false, message: 'Internal server error' })
        }
    }

}

module.exports = new PostController();

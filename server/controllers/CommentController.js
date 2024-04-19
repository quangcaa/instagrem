const Post = require('../models/Post')
const Like = require('../models/Like')
const Comment = require('../models/Comment')

class CommentController {

    // @route [POST] /comment/p/:post_id
    // @desc comment post
    // @access Private
    async createComment(req, res) {
        const { post_id } = req.params
        const { comment } = req.body
        const me = req.userId

        try {
            // check if post exists
            const post = await Post.findById(post_id)
            if (!post) {
                return res.status(404).json({ success: false, message: 'Post not found' })
            }

            // add comment to db
            const newComment = new Comment({
                comment,
                post_id,
                user_id: me
            })
            await newComment.save()

            // increment comment count
            await Post.findByIdAndUpdate(post_id, { $inc: { comments_count: 1 } }, { new: true })

            res.json({ success: true, message: 'Commented post' })
        } catch (error) {
            console.error('Error cre function in CommentController: ', error)
            return res.status(500).json({ error: 'Internal Server Error' })
        }
    }


    // @route [DELETE] /comment/p/:post_id
    // @desc delete comment 
    // @access Private
    async deleteComment(req, res) {
        // const { post_id } = req.params
        // const { comment } = req.body
        // const me = req.userId

        // try {
        //     // check if post exists
        //     const post = await Post.findById(post_id)
        //     if (!post) {
        //         return res.status(404).json({ success: false, message: 'Post not found' })
        //     }

        //     // add comment to db
        //     const newComment = new Comment({
        //         comment,
        //         post_id,
        //         user_id: me
        //     })
        //     await newComment.save()

        //     // increment comment count
        //     await Post.findByIdAndUpdate(post_id, { $inc: { comments_count: 1 } }, { new: true })

        //     res.json({ success: true, message: 'Commented post' })
        // } catch (error) {
        //     console.error('Error cre function in CommentController: ', error)
        //     return res.status(500).json({ error: 'Internal Server Error' })
        // }
    }


}

module.exports = new CommentController()
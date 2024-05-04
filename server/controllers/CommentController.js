const Post = require('../mongo_models/Post')
const Like = require('../mongo_models/Like')
const Comment = require('../mongo_models/Comment')
const { sendReplyActivity } = require('../utils/sendActivity')

class CommentController {

    // @route [POST] /comment/p/:post_id
    // @desc comment post
    // @access Private
    async createComment(req, res) {
        const { post_id } = req.params
        const { comment } = req.body
        const me = req.user.user_id

        // check if comment is empty
        if (!comment) {
            return res.status(400).json({ success: false, message: 'Comment is required' })
        }

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
            const postAfter = await Post.findByIdAndUpdate(
                post_id,
                { $inc: { comments_count: 1 } },
                { new: true }
            )

            // send reply activity
            sendReplyActivity(req, me, post.user_id, 'replies', post._id, '', 'Replied your post', newComment.comment)

            res.status(201).json({
                success: true, message: 'Commented post !',
                comment: newComment,
                post: postAfter
            })
        } catch (error) {
            console.error('Error createComment function in CommentController: ', error)
            return res.status(500).json({ error: 'Internal Server Error' })
        }
    }


    // @route [POST] /comment/c/:parent_id
    // @desc reply comment 
    // @access Private
    async createCommentReply(req, res) {
        const { parent_id } = req.params
        const { comment } = req.body
        const me = req.user.user_id

        try {
            // check if comment exists
            const parentComment = await Comment.findById(parent_id)
            if (!parentComment) {
                return res.status(404).json({ success: false, message: 'Comment not found' })
            }

            // add comment to db
            const newComment = new Comment({
                comment,
                post_id: parentComment.post_id,
                user_id: me,
                parent_id,
            })
            await newComment.save()

            // increment comment count
            const postAfter = await Post.findByIdAndUpdate(
                parentComment.post_id,
                { $inc: { comments_count: 1 } },
                { new: true }
            )

            // send reply activity
            sendReplyActivity(req, me, parentComment.user_id, 'replies', parentComment.post_id, newComment._id, 'Replied your comment', newComment.comment)

            res.json({
                success: true, message: 'Replied Comment !',
                comment: newComment,
                post: postAfter
            })
        } catch (error) {
            console.error('Error createCommentReply function in CommentController: ', error)
            return res.status(500).json({ error: 'Internal Server Error' })
        }
    }


    // @route [GET] /comment/c/:parent_id/reply/:offset
    // @desc get all replies of comment
    // @access Public
    async retrieveCommentReplies(req, res) {
        const { parent_id, offset } = req.params

        try {
            // check if comment exists
            const parentComment = await Comment.findById(parent_id)
            if (!parentComment) {
                return res.status(404).json({ success: false, message: 'Comment not found' })
            }

            // get all replies of comment
            const replies = await Comment.find({ parent_id })
                .sort({ createdAt: 1 })
                .skip(parseInt(offset))
                .limit(10)

            if (replies.length === 0) {
                return res.status(404).json({ success: false, message: 'No replies found' })
            }

            return res.send({ success: true, replies })
        } catch (error) {
            console.error('Error retrieveCommentReplies function in CommentController: ', error)
            return res.status(500).json({ error: 'Internal Server Error' })
        }
    }


    // @route [DELETE] /comment/:comment_id
    // @desc delete comment 
    // @access Private
    async deleteComment(req, res) {
        const { comment_id } = req.params
        const me = req.user.user_id

        try {
            // delete comment
            const deleteCommentCondition = { _id: comment_id, user_id: me }
            const deletedComment = await Comment.findOneAndDelete(deleteCommentCondition)

            if (!deletedComment) {
                return res.status(401).json({ success: false, message: 'Could not delete comment' })
            }

            // delete all reply comment if this is parent
            const deletedChildComments = await Comment.deleteMany({ parent_id: comment_id })

            // update post comments_count
            const decrementCount = -(1 + deletedChildComments.deletedCount)

            const postAfter = await Post.findByIdAndUpdate(
                deletedComment.post_id,
                { $inc: { comments_count: decrementCount } },
                { new: true }
            )

            res.status(200).json({
                success: true, message: 'Deleted comment !',
                comment: deletedComment,
                childComment: deletedChildComments,
                post: postAfter
            })
        } catch (error) {
            console.error('Error deleteComment function in CommentController: ', error)
            return res.status(500).json({ error: 'Internal Server Error' })
        }
    }

}

module.exports = new CommentController()
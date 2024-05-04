const Post = require('../mongo_models/Post')
const Like = require('../mongo_models/Like')
const Comment = require('../mongo_models/Comment')

const { sequelize, User } = require('../mysql_models')

const { sendLikeActivity } = require('../utils/sendActivity')

class LikeController {

    // @route [POST] /like/p/:post_id
    // @desc like and unlike post
    // @access Private
    async likePost(req, res) {
        const { post_id } = req.params
        const me = req.user.user_id

        try {
            // check if post exists
            const post = await Post.findById(post_id)
            if (!post) {
                return res.status(404).json({ success: false, error: 'Post not found' })
            }

            // check if user already liked post
            const existingLike = await Like.findOne({ post_id, user_id: me })

            if (existingLike) {
                // conditions 
                const likeDeleteCondition = { _id: existingLike._id, post_id: post_id, user_id: me }

                // unlike post
                const deletedLike = await Like.findOneAndDelete(likeDeleteCondition)

                if (deletedLike) {
                    // decrement post likes count
                    await Post.findByIdAndUpdate(post_id, { $inc: { likes_count: -1 } })
                    return res.json({ success: true, message: 'Unliked post !' })
                }

                return res.status(500).json({ error: 'Failed to unlike post !' })
            }

            // save like to db
            const newLike = new Like({
                post_id,
                user_id: me,
            })
            await newLike.save()

            // increment post likes count
            await Post.findByIdAndUpdate(post_id, { $inc: { likes_count: 1 } })

            // send like activity
            sendLikeActivity(req, me, post.user_id, 'likes', post._id, '', 'Liked your post', post.caption)

            res.json({ success: true, message: 'Liked post ! ! !' })
        } catch (error) {
            console.error('Error likePost function in LikeController: ', error)
            return res.status(500).json({ error: 'Internal Server Error' })
        }
    }


    // @route [POST] /like/c/:comment_id
    // @desc like and unlike comment
    // @access Private
    async likeComment(req, res) {
        const { comment_id } = req.params
        const me = req.user.user_id

        try {
            // check if comment exists
            const comment = await Comment.findById(comment_id)
            if (!comment) {
                return res.status(404).json({ success: false, error: 'Comment not found' })
            }

            // check if user already liked comment
            const existingLike = await Like.findOne({ comment_id, user_id: me })

            if (existingLike) {
                // conditions
                const likeDeleteCondition = { _id: existingLike._id, comment_id, user_id: me }

                // unlike comment
                const deletedLike = await Like.findOneAndDelete(likeDeleteCondition)

                if (deletedLike) {
                    // decrement comment likes count
                    await Comment.findByIdAndUpdate(comment_id, { $inc: { likes_count: -1 } })
                    return res.json({ success: true, message: 'Unliked comment !' })
                }

                return res.status(500).json({ error: 'Failed to unlike comment !' })
            }

            // save like to db
            const newLike = new Like({
                comment_id,
                user_id: me,
            })
            await newLike.save()

            // increment comment likes count
            await Comment.findByIdAndUpdate(comment_id, { $inc: { likes_count: 1 } })

            // send like activity
            sendLikeActivity(req, me, comment.user_id, 'likes', comment.post_id, comment._id, 'Liked your comment', comment.comment)

            res.json({ success: true, message: 'Liked comment !' })
        } catch (error) {
            console.error('Error likeComment function in LikeController: ', error)
            return res.status(500).json({ error: 'Internal Server Error' })
        }
    }


    // @route [GET] /like/l/:post_id
    // @desc retrieve post likes
    // @access Public
    async retrievePostLike(req, res) {
        const { post_id } = req.params
        const me = req.user.user_id

        try {
            // check if post exist
            const postById = await Post.findById(post_id)
            if (!postById || postById.status === 'DELETED' || postById.status === "ARCHIVED") {
                return res.status(404).json({ success: false, error: 'Post not found' })
            }

            // get all likes
            const likes = await Like.find({ post_id }).sort({ createdAt: -1 })

            // get user details for each like
            const likeDetails = []
            for (const like of likes) {
                const user = await User.findOne(
                    { where: { user_id: like.user_id } },
                    { attributes: ['username', 'full_name', 'profile_image_url'] }
                )

                likeDetails.push({
                    username: user.username,
                    full_name: user.full_name,
                    profile_image_url: user.profile_image_url,
                    time: like.createdAt
                })
            }

            res.json({ success: true, likes: likeDetails })
        } catch (error) {
            console.log(error)
            res.status(500).json({ success: false, message: 'Internal server error' })
        }
    }

}

module.exports = new LikeController()
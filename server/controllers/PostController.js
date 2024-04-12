const Post = require('../models/Post')
const Like = require('../models/Like')
const Comment = require('../models/Comment')
const mysql_con = require('../config/db/mysql')

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

    // @route [GET] /post/:post_id
    // @desc find post by id
    // @access Public
    async retrievePost(req, res) {
        const { post_id } = req.params

        try {
            // get post by id
            const postById = await Post.findById(post_id, { post_type: 0, status: 0, updatedAt: 0 })
            if (!postById || postById.status === 'DELETED' || postById.status === "ARCHIVED") {
                return res.status(404).json({ success: false, message: 'Post not found' })
            }

            // get post author
            const getPostAuthorQuery = `
                                       SELECT username, profile_image_url
                                       FROM users
                                       WHERE user_id = ?
                                       `
            const getPostAuthor = (getPostAuthorQuery) => {
                return new Promise((resolve, reject) => {
                    mysql_con.query(getPostAuthorQuery, [postById.user_id], (error, results) => {
                        if (error) {
                            reject(error)
                        }

                        resolve(results[0])
                    })
                })
            }
            const postAuthor = await getPostAuthor(getPostAuthorQuery)

            // get post comments
            const postComments = await Comment.find({ post_id })

            res.json({
                success: true,
                user: postAuthor,
                post: postById,
                comments: postComments,
            })
        } catch (error) {
            console.log(error)
            res.status(500).json({ success: false, message: 'Internal server error' })
        }
    }

    // @route [GET] /post/explore/:hashtag
    // @desc retrieve posts by hashtag
    // @access Public
    async retrieveHashtagPost(req, res) {
        const { hashtag } = req.params

        try {
            const posts = await Post.aggregate([
                {
                    $match: { hashtags: hashtag }
                },
                {
                    $facet: {
                        posts: [
                            { $match: { hashtags: hashtag } },
                            { $sort: { createdAt: -1 } },
                            { $limit: 20 },
                            {
                                $project: {
                                    _id: 1,
                                    likes_count: 1,
                                    comments_count: 1,
                                    media_url: { arrayElemAt: ['$media_url', 0] },
                                }
                            }
                        ],
                        postCount: [
                            { $match: { hashtags: hashtag } },
                            { $count: 'count' }
                        ]
                    }
                }
            ])

            return res.send(posts[0])
        } catch (error) {
            console.log(error)
            res.status(500).json({ success: false, message: 'Internal server error' })
        }
    }

    // @route [POST] /:post_id/like
    // @desc like post
    // @access Private
    async likePost(req, res) {
        const { post_id } = req.params

        try {
            // check if post exists
            const post = await Post.findById(post_id)
            if (!post) {
                return res.status(404).json({ success: false, message: 'Post not found' })
            }

            // check if user already liked post
            const existingLike = await Like.findOne({ post_id, user_id: req.userId })

            if (existingLike) {
                // unlike post
                await Like.findByIdAndDelete(existingLike._id)

                // decrement post likes count
                await Post.findByIdAndUpdate(post_id, { $inc: { likes_count: -1 } })

                return res.json({ success: true, message: 'Unliked post !' })
            }

            // save like to db
            const newLike = new Like({
                post_id,
                user_id: req.userId,
            })
            await newLike.save()

            // increment post likes count
            await Post.findByIdAndUpdate(post_id, { $inc: { likes_count: 1 } })

            res.json({ success: true, message: 'Liked post !' })
        } catch (error) {
            console.log(error)
            res.status(500).json({ success: false, message: 'Internal server error' })
        }
    }

    // @route [GET] /post/feed
    // @desc retrieve user feed
    // @access Private
}

module.exports = new PostController();

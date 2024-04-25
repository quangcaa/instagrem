const Post = require('../mongo_models/Post')
const Like = require('../mongo_models/Like')
const Comment = require('../mongo_models/Comment')

const { sequelize, User, Follow } = require('../mysql_models')

const cloudinary = require('../config/storage/cloudinary')

const { sendMentionActivity } = require('../utils/sendActivity')

class PostController {

    // @route [POST] /post/create
    // @desc create post
    // @access Private
    async createPost(req, res) {
        const { caption } = req.body
        const user_id = req.user.user_id

        // let transformation = {
        //     width: 555,
        //     height: 555,
        //     crop: 'fill',
        //     gravity: 'center',
        //     quality: 'auto:best'
        // }

        // check if caption is provided
        if (!caption) {
            return res.status(400).json({ success: false, error: 'Missing caption' })
        }

        // check if media is provided
        if (!req.files['image'] && !req.files['video']) {
            return res.status(400).json({ success: false, error: 'Please provide the image to upload.' })
        }

        // extract hashtags and mentions
        const hashtags = extractHashtags(caption)
        const mentions = extractMentions(caption)

        // create post
        try {
            let mediaUrls = []

            if (req.files['image']) {
                const images = req.files['image']
                for (let image of images) {
                    const imageResult = await cloudinary.uploader.upload(image.path, { folder: 'posts', resource_type: 'auto' })
                    mediaUrls.push(imageResult.secure_url)
                }
            }

            if (req.files['video']) {
                const video = req.files['video'][0]
                const videoResult = await cloudinary.uploader.upload(video.path, { folder: 'posts', resource_type: 'video' })
                mediaUrls.push(videoResult.secure_url)
            }

            const newPost = new Post({
                caption,
                media_url: mediaUrls,
                hashtags: hashtags,
                mentions: mentions,
                user_id,
            })

            await newPost.save()

            // add mention acitivty
            for (let mention of mentions) {
                const receiver = await User.findOne({ username: mention.substring(1) })
                if (receiver.length > 0 && receiver !== null) {
                    sendMentionActivity(req, user_id, receiver[0].user_id, 'mentions', newPost._id, '', 'Mentioned you', newPost.caption)
                }
            }

            res.json({ success: true, message: 'Created post !', post: newPost })
        } catch (error) {
            console.log(error)
            res.status(500).json({ success: false, message: 'Internal server error' })
        }
    }

    // @route [PUT] /post/:post_id
    // @desc update post
    // @access Private
    async updatePost(req, res) {
        const { post_id } = req.params
        const { caption, media_url, hashtags, mentions } = req.body
        const user_id = req.user.user_id

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

            const postUpdateCondition = { _id: post_id, user_id }

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

    // @route [DELETE] /post/:post_id
    // @desc delete post
    // @access Private
    async deletePost(req, res) {
        const { post_id } = req.params
        const user_id = req.user.user_id

        try {
            const postDeleteCondition = { _id: post_id, user_id: user_id }
            const deletedPost = await Post.findOneAndDelete(postDeleteCondition)

            // user not authorised 
            if (!deletedPost) {
                return res.status(401).json({ success: false, message: 'Post not found or user not authorised' })
            }

            // delete all comment
            const getDeleteComment = await Comment.find({ post_id })
            const deletedComment = await Comment.deleteMany({ post_id })

            // delete all like post and like comment
            const deletedLike = await Like.deleteMany({
                $or: [
                    { post_id: post_id },
                    { comment_id: { $in: getDeleteComment } }
                ]
            })

            res.json({
                success: true, message: 'Deleted post !',
                post: deletedPost,
                like: deletedLike,
                comment: deletedComment
            })
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
            const postAuthor = await User.findByPk(
                postById.user_id,
                { attributes: ['user_id', 'username', 'profile_image_url'] }
            )

            // get post comments
            const postComments = await Comment.find({ post_id }).sort({ createdAt: -1 })

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

    // @route [GET] /post/u/:username
    // @desc retrieve user posts
    // @access Public
    async retrieveUserPosts(req, res) {
        const { username } = req.params

        try {
            const user = await User.findOne(
                { where: { username } },
                { attributes: ['user_id', 'username', 'profile_image_url'] }
            )
            if (!user) {
                return res.status(404).json({ error: 'User not found' })
            }

            const posts = await Post.find({ user_id: user.user_id })
                .sort({ createdAt: -1 })
                .select({ post_type: 0, status: 0, updatedAt: 0 })

            return res.status(200).json({ success: true, user, posts })
        } catch (error) {
            console.error('Error retrieveUserPosts function in PostController: ', error)
            return res.status(500).json({ error: 'Internal Server Error' })
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


    // @route [GET] /post/following/:offset
    // @desc retrieve user following feed
    // @access Private
    async retrieveFollowingFeed(req, res) {
        const user_id = req.user.user_id
        const { offset } = req.params

        try {
            const followingList = await Follow.findAll({
                where: { follower_user_id: user_id },
                attributes: ['followed_user_id']
            })

            const userFollowingPost = await Post.find({ 'user_id': { $in: followingList } })
                .sort({ likes_count: -1, comments_count: -1, createdAt: -1 })
                .limit(20)
                .skip(Number(offset))

            res.status(200).json({ success: true, user: user_id, posts: userFollowingPost })
        } catch (error) {
            console.log(error)
            res.status(500).json({ success: false, message: 'Internal server error' })
        }
    }

}

// function for createPost
function extractHashtags(caption) {
    const hashtags = new Set()

    const regex = /#[a-zA-Z0-9_]+/g

    let match
    while ((match = regex.exec(caption)) !== null) {
        const hashtag = match[0]// Use match[0] to get the entire matched hashtag including '#'
        hashtags.add(hashtag)
    }

    return Array.from(hashtags)// Convert set to array
}

function extractMentions(caption) {
    const mentions = new Set()

    const regex = /@[a-zA-Z0-9_]+/g

    let match
    while ((match = regex.exec(caption)) !== null) {
        const mention = match[0]// Use match[0] to get the entire matched mention including '@'
        mentions.add(mention)
    }

    return Array.from(mentions)// Convert set to array
}

module.exports = new PostController()
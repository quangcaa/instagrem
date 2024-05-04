const Post = require('../mongo_models/Post')
const Like = require('../mongo_models/Like')
const Comment = require('../mongo_models/Comment')
const mongoose = require('mongoose')

const { sequelize, User, Follow } = require('../mysql_models')
const { s3, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require('../config/storage/s3')
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner")
const { randomMediaName } = require('../utils/randomMediaName')
const { sendMentionActivity } = require('../utils/sendActivity')

const sharp = require('sharp')

class PostController {

  // @route [POST] /post/create
  // @desc create post
  // @access Private
  async createPost(req, res) {
    const { caption } = req.body
    const user_id = req.user.user_id

    // check if caption and image is provided
    if (!caption && !req.files) {
      return res.status(400).json({ success: false, error: 'Please provide caption or media file.' })
    }

    // extract hashtags and mentions
    const hashtags = extractHashtags(caption)
    const mentions = extractMentions(caption)

    // create post
    try {
      let mediaUrls = [];

      if (req.files) {
        const images = req.files

        if (images.length > 5) {
          return res.status(400).json({ success: false, error: 'Maximum 5 images allowed.' })
        }

        for (let image of images) {
          const buffer = await sharp(image.buffer)
            .resize({ width: 560, height: 770, fit: 'contain' })
            .toBuffer()

          const params = {
            Bucket: process.env.BUCKET_NAME,
            Key: randomMediaName(),
            Body: buffer,
            ContentType: image.mimetype
          }

          const command = new PutObjectCommand(params)
          await s3.send(command)

          mediaUrls.push(params.Key)
        }
      }

      const newPost = new Post({
        caption,
        media_url: mediaUrls,
        hashtags,
        mentions,
        user_id,
      })

      await newPost.save();

      // add mention activity
      for (let mention of mentions) {
        const receiver = await User.findOne({ username: mention.substring(1) })
        if (receiver && receiver !== null) {
          sendMentionActivity(req, user_id, receiver.user_id, 'mentions', newPost._id, '', 'Mentioned you', newPost.caption)
        }
      }

      res.json({ success: true, message: 'Created post!', post: newPost })
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
      return res
        .status(400)
        .json({ success: false, message: "Missing caption" });
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
        return res
          .status(401)
          .json({
            success: false,
            message: "Post not found or user not authorised",
          });
      }

      res.json({ success: true, message: "Updated post !", post: updatedPost });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }

  // @route [DELETE] /post/:post_id
  // @desc delete post
  // @access Private
  async deletePost(req, res) {
    const { post_id } = req.params
    const user_id = req.user.user_id

    try {
      const session = await mongoose.startSession()
      session.startTransaction()

      const postDeleteCondition = { _id: post_id, user_id: user_id }
      const deletedPost = await Post.findOneAndDelete(postDeleteCondition).session(session)

      // user not authorised 
      if (!deletedPost) {
        await session.abortTransaction()
        session.endSession()
        return res.status(401).json({ success: false, message: 'Post not found or user not authorised' })
      }

      // delete likes and comments
      await Promise.all([
        Like.deleteMany({ post_id }).session(session),
        Comment.deleteMany({ post_id }).session(session)
      ])

      await session.commitTransaction()

      // delete on s3
      for (let image of deletedPost.media_url) {
        const params = {
          Bucket: process.env.BUCKET_NAME,
          Key: image
        }
        const command = new DeleteObjectCommand(params)
        await s3.send(command)
      }

      res.json({
        success: true, message: 'Deleted post !',
        post: deletedPost,
      })
    } catch (error) {
      console.error('Error deletePost function: ', error)
      res.status(500).json({ success: false, message: 'Internal server error' })
    }
  }

  // @route [GET] /post/:post_id
  // @desc find post by id
  // @access Public
  async retrievePost(req, res) {
    const { post_id } = req.params;

    try {
      // get post by id
      const postById = await Post.findById(post_id, {
        post_type: 0,
        status: 0,
        updatedAt: 0,
      });
      if (
        !postById ||
        postById.status === "DELETED" ||
        postById.status === "ARCHIVED"
      ) {
        return res
          .status(404)
          .json({ success: false, message: "Post not found" });
      }

      let mediaUrls = []

      for (let image of postById.media_url) {
        // get signed url for media
        const getObjectParams = {
          Bucket: process.env.BUCKET_NAME,
          Key: image
        }
        const command = new GetObjectCommand(getObjectParams)
        const url = await getSignedUrl(s3, command, { expiresIn: 60 })
        mediaUrls.push(url)
      }

      postById.media_url = mediaUrls

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

      for (let post of posts) {
        let mediaUrls = []

        for (let image of post.media_url) {
          // get signed url for media
          const getObjectParams = {
            Bucket: process.env.BUCKET_NAME,
            Key: image
          }
          const command = new GetObjectCommand(getObjectParams)
          const url = await getSignedUrl(s3, command, { expiresIn: 60 })
          mediaUrls.push(url)
        }

        post.media_url = mediaUrls
      }

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
    const { hashtag } = req.params;

    try {
      const posts = await Post.aggregate([
        {
          $match: { hashtags: hashtag },
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
                  media_url: { arrayElemAt: ["$media_url", 0] },
                },
              },
            ],
            postCount: [{ $match: { hashtags: hashtag } }, { $count: "count" }],
          },
        },
      ]);

      return res.send(posts[0]);
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }


  // @route [GET] /post/following/:offset
  // @desc retrieve user following feed
  // @access Private
  async retrieveFollowingFeed(req, res) {
    const user_id = req.user.user_id
    const { offset = 0 } = req.params

    try {
      const followingList = await Follow.findAll({
        where: { follower_user_id: user_id },
        attributes: ['followed_user_id']
      })
      const followingListIds = followingList.map(follow => follow.followed_user_id)

      const userFollowingPost = await Post.find({ user_id: { $in: followingListIds } })
        .sort({ likes_count: -1, comments_count: -1, createdAt: -1 })
        .limit(20)
        .skip(Number(offset))

      res
        .status(200)
        .json({ success: true, user: user_id, posts: userFollowingPost });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
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
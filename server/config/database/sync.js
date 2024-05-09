require('dotenv').config()
const { client, subClient, pubClient } = require('./redis')

const mongoose = require('mongoose')
const mongoDB = require('./mongodb')
const Post = require('../../mongo_models/Post')
const Like = require('../../mongo_models/Like')
const Comment = require('../../mongo_models/Comment')
const Conversation = require('../../mongo_models/Conversation')
const Message = require('../../mongo_models/Message')

const MySQLEvents = require('@rodrigogs/mysql-events')

async function sync() {

    // MYSQL
    const instance = new MySQLEvents({
        host: process.env.MYSQL_DB_HOST,
        port: process.env.MYSQL_DB_PORT,
        user: process.env.MYSQL_DB_USER,
        password: process.env.MYSQL_DB_PASSWORD,
    }, {
        startAtEnd: true,
    })

    instance.addTrigger({
        name: 'Monitor user_id changes',
        expression: 'threads.users.user_id',
        statement: MySQLEvents.STATEMENTS.UPDATE,
        onEvent: (event) => {
            const affectedRow = event.affectedRows[0]
            const oldUserId = affectedRow.before.user_id
            const newUserId = affectedRow.after.user_id

            // update the token in Redis
            client.del(`user:${oldUserId}`)

            // publish the change to a Redis channel
            pubClient.publish('user_update', JSON.stringify({ old_user_id: oldUserId, new_user_id: newUserId }))
        },
    })

    instance.start()

    mongoDB.connect()

    // MongoDB
    try {
        await subClient.subscribe('user_update', async message => {
            const update = JSON.parse(message)
            const old_user_id = update.old_user_id
            const new_user_id = update.new_user_id

            await Promise.all([
                Post.updateMany(
                    { user_id: old_user_id },
                    { $set: { user_id: new_user_id } }
                ),

                Like.updateMany(
                    { user_id: old_user_id },
                    { $set: { user_id: new_user_id } }
                ),

                Comment.updateMany(
                    { user_id: old_user_id },
                    { $set: { user_id: new_user_id } }
                ),

                Conversation.updateMany(
                    { participants: old_user_id },
                    { $set: { "participants.$": new_user_id } }
                ),

                Message.updateMany(
                    { sender_id: old_user_id },
                    { $set: { sender_id: new_user_id } }
                ),
                Message.updateMany(
                    { receiver_id: old_user_id },
                    { $set: { receiver_id: new_user_id } }
                ),
            ])

            console.log('Sync change')
        })
    } catch (error) {
        console.error('Error connecting to MongoDB:', error)
    }



    const PostDB = mongoose.model('posts')
    const changeStream = PostDB.watch()

    changeStream.on('change', async (change) => {
        console.log(change)

        // like check
        if (change.operationType === 'update' && 'likes_count' in change.updateDescription.updatedFields) {
            // get the post ID from the change document
            const postId = change.documentKey._id

            // get the updated likes_count
            const updatedLikesCount = change.updateDescription.updatedFields.likes_count

            // count the number of like documents for this post
            const likeCount = await Like.countDocuments({ post_id: postId })

            // check if the updated likes_count is equal to the number of Like documents
            if (updatedLikesCount !== likeCount) {
                console.log(`Mismatch in likes_count for post ${postId}: likes_count is ${updatedLikesCount}, but there are ${likeCount} Like documents.`)

                // Update the likes_count to create a mismatch
                await Post.updateOne({ _id: postId }, { likes_count: likeCount })
            }
        }

        // comment check
        if (change.operationType === 'update' && 'comments_count' in change.updateDescription.updatedFields) {
            const postId = change.documentKey._id

            const updatedCommentsCount = change.updateDescription.updatedFields.comments_count

            const commentCount = await Comment.countDocuments({ post_id: postId })

            if (updatedCommentsCount !== commentCount) {
                console.log(`Mismatch in comments_count for post ${postId}: comments_count is ${updatedCommentsCount}, but there are ${commentCount} Like documents.`)

                await Post.updateOne({ _id: postId }, { comments_count: commentCount })
            }
        }
    })
}

module.exports = { sync }

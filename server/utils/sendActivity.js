const { sequelize, User, Activity } = require('../mysql_models')


const sendLikeActivity = async (
    req,
    sender_id,
    receiver_id,
    activity_type,
    post_id,
    comment_id,
    activity_title,
    activity_message
) => {
    try {
        // send like activity
        if (String(sender_id) !== String(receiver_id)) {
            // check if activity exists
            const checkLike = await Activity.findOne({
                where: { sender_id, receiver_id, activity_type, post_id, comment_id }
            })

            // if not, add activity to db
            if (!checkLike) {
                await Activity.create({
                    sender_id,
                    receiver_id,
                    activity_type,
                    post_id,
                    comment_id,
                    activity_title,
                    activity_message
                })
            }

            // log
            console.log('Like activity sent ! ! !')
        }
    } catch (error) {
        console.log(error)
    }
}

const sendReplyActivity = async (
    req,
    sender_id,
    receiver_id,
    activity_type,
    post_id,
    comment_id,
    activity_title,
    activity_message
) => {
    try {
        // send reply activity
        if (String(sender_id) !== String(receiver_id)) {
            await Activity.create({
                sender_id,
                receiver_id,
                activity_type,
                post_id,
                comment_id,
                activity_title,
                activity_message
            })

            // log
            console.log('Reply activity sent ! ! !')
        }
    } catch (error) {
        console.log(error)
    }
}

const sendFollowActivity = async (
    req,
    sender_id,
    receiver_id,
    activity_type,
    activity_title
) => {
    try {
        // send follow activity
        // check if activity exists
        const checkFollow = await Activity.findOne(
            { where: { sender_id, receiver_id, activity_type } }
        )

        // if not, add activity to db
        if (!checkFollow) {
            await Activity.create({
                sender_id,
                receiver_id,
                activity_type,
                activity_title
            })

            // log
            console.log('Follow activity sent ! ! !')
        }
    } catch (error) {
        console.log(error)
    }
}

const sendMentionActivity = async (
    req,
    sender_id,
    receiver_id,
    activity_type,
    post_id,
    comment_id,
    activity_title,
    activity_message
) => {
    try {
        // send mention activity
        if (sender_id !== receiver_id) {
            // check if activity exists
            const checkMention = await Activity.findOne(
                { where: { sender_id, receiver_id, activity_type, post_id, comment_id } }
            )

            // if not, add activity to db
            if (!checkMention) {
                await Activity.create({
                    sender_id,
                    receiver_id,
                    activity_type,
                    post_id,
                    comment_id,
                    activity_title,
                    activity_message
                })

                // log
                console.log('Mention activity sent ! ! !')
            }
        }
    } catch (error) {
        console.log(error)
    }
}


module.exports = { sendLikeActivity, sendReplyActivity, sendFollowActivity, sendMentionActivity }
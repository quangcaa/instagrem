const mysql_con = require('../config/database/mysql')

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
        if (sender_id !== receiver_id) {
            // check if activity exists
            const checkLikeQuery = `
                            SELECT *
                            FROM activities
                            WHERE sender_id = ? 
                            AND receiver_id = ? 
                            AND activity_type = ?
                            AND post_id = ?
                            AND comment_id = ?
                            `
            const [checkLike] = await mysql_con.promise().query(checkLikeQuery, [sender_id, receiver_id, activity_type, post_id, comment_id])

            // if not, add activity to db
            if (checkLike.length <= 0) {
                const sendActivityQuery = `
                                            INSERT INTO activities (sender_id, receiver_id, activity_type, post_id, comment_id, activity_title, activity_message)
                                            VALUES (?,?,?,?,?,?,?)
                                            `
                await mysql_con.promise().query(sendActivityQuery, [sender_id, receiver_id, activity_type, post_id, comment_id, activity_title, activity_message])
            }
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
            const sendActivityQuery = `
                                        INSERT INTO activities (sender_id, receiver_id, activity_type, post_id, comment_id, activity_title, activity_message)
                                        VALUES (?,?,?,?,?,?,?)
                                        `
            await mysql_con.promise().query(sendActivityQuery, [sender_id, receiver_id, activity_type, post_id, comment_id, activity_title, activity_message])

        }
    } catch (error) {
        console.log(error)
    }
}

module.exports = { sendLikeActivity, sendReplyActivity }
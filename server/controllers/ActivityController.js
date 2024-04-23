const mysql_con = require('../config/database/mysql')

class ActivityController {

    // @route [GET] /activity
    // @desc get user activity
    // @access Private
    async retrieveActivity(req, res) {
        const receiver_id = req.user.user_id

        try {
            const getActivityQuery =    `
                                        SELECT a.activity_type,
                                               a.source_user_id,
                                               a.post_id,
                                               activity_title,
                                               a.activity_message,
                                               a.is_read,
                                               a.created_at,
                                               u.user_id,
                                               u.username,
                                               u.profile_image_url
                                        FROM activities a
                                        JOIN users u ON a.source_user_id = u.user_id
                                        WHERE a.user_id = ?
                                        ORDER BY created_at DESC
                                        `
            const [activityResult] = await mysql_con.promise().query(getActivityQuery, [receiver_id])

            return res.status(200).json({ success: true, activities: activityResult })
        } catch (error) {
            console.error('Error retrieveActivity function in ActivityController: ', error)
            return res.status(500).json({ error: 'Internal Server Error' })
        }
    }


    // @route [PUT] /activity
    // @desc mark activities as read
    // @access Private
    async readActivity(req, res) {
        const user_id = req.user.user_id

        try {
            const markAsReadQuery = `
                                    UPDATE activities
                                    SET is_read = 1
                                    WHERE user_id = ?
                                    `
            await mysql_con.promise().query(markAsReadQuery, [user_id])

            return res.status(200).json({ success: true, message: 'Read all activities ! ! !' })
        } catch (error) {
            console.error('Error readActivity function in ActivityController: ', error)

            return res.status(500).json({ error: 'Internal Server Error' })
        }
    }
}

module.exports = new ActivityController()
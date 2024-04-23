const mysql_con = require('../config/database/mysql')

// const { createClient } = require('../config/database/redis')
// const client = createClient()
// const redisClient  = require('../config/database/redis')

class ActivityController {

    // @route [GET] /activity
    // @desc get user activity
    // @access Private
    async retrieveActivity(req, res) {
        const receiver_id = req.user.user_id

        // await redisClient.connect()

        try {
            // Check if the data is already cached in Redis
            // const cachedData = await redisClient.get(`activity:${receiver_id}`)
            // if (cachedData) {
            //     const activities = JSON.parse(cachedData)
            //     return res.status(200).json({ success: true, activities })
            // }

            const getActivityQuery = `
                                        SELECT a.activity_type,
                                               a.receiver_id,
                                               a.post_id,
                                               activity_title,
                                               a.activity_message,
                                               a.is_read,
                                               a.created_at,
                                               u.user_id,
                                               u.username,
                                               u.profile_image_url
                                        FROM activities a
                                        JOIN users u ON a.receiver_id = u.user_id
                                        WHERE a.sender_id = ?
                                        ORDER BY created_at DESC
                                        `
            const [activityResult] = await mysql_con.promise().query(getActivityQuery, [receiver_id])

            // cache the retrieved data in Redis
            // await redisClient.set(`activity:${receiver_id}`, JSON.stringify(activityResult))

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
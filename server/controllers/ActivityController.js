const { Query } = require('mongoose')
const { client } = require('../config/database/redis')

const { sequelize, User, Activity } = require('../mysql_models')

class ActivityController {

    // @route [GET] /activity
    // @desc get user activity
    // @access Private
    async retrieveActivity(req, res) {
        const receiver_id = req.user.user_id

        try {
            // check if the data is already cached in Redis
            const cachedData = await client.get(`retrieveActivity:${receiver_id}`)
            if (cachedData) {
                const activities = JSON.parse(cachedData)
                return res.status(200).json({ success: true, message: 'this is cached data', activities })
            }

            // retrieve activity from db
            const activityResult = await sequelize.query(
                `  
                SELECT 
                    a.activity_type,
                    a.sender_id,
                    a.receiver_id,
                    a.post_id,
                    activity_title,
                    a.activity_message,
                    a.is_read,
                    a.createdAt,
                    u.user_id,
                    u.username,
                    u.profile_image_url
                FROM activities a
                JOIN users u ON a.sender_id = u.user_id
                WHERE a.receiver_id = ?
                ORDER BY createdAt DESC
                `,
                {
                    replacements: [receiver_id],
                    type: sequelize.QueryTypes.SELECT
                }
            )

            // cache data in Redis
            await client.set(`retrieveActivity:${receiver_id}`, JSON.stringify(activityResult), { EX: 60 })

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
            // mark all activities as read
            await Activity.update(
                { is_read: true },
                { where: { receiver_id: user_id } }
            )

            // set new cache for activities
            // await client.set(`retrieveActivity:${user_id}`, JSON.stringify([]))

            return res.status(200).json({ success: true, message: 'Read all activities ! ! !' })
        } catch (error) {
            console.error('Error readActivity function in ActivityController: ', error)

            return res.status(500).json({ error: 'Internal Server Error' })
        }
    }
}

module.exports = new ActivityController()
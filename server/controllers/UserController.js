const { sequelize, User, Follow } = require('../mysql_models')

const { client } = require('../config/database/redis')

const { sendFollowActivity } = require('../utils/sendActivity')

class UserController {

    // @route [GET] /user/:identifier
    // @desc get user information by user_id or username
    // @access Public
    async retrieveUser(req, res) {
        const { identifier } = req.params
        const me = req.user.user_id

        try {
            // check if user exists
            const checkUser = await User.findOne({
                where: sequelize.or(
                    { user_id: identifier },
                    { username: identifier }
                ),
                attributes: ['user_id', 'username', 'full_name', 'bio', 'profile_image_url']
            })

            if (!checkUser) {
                return res.status(400).json({ success: false, error: 'User not found' })
            }

            // check if user information is cached
            const cachedData = await client.get(`user:${checkUser.user_id}`)
            if (cachedData) {
                const userInfo = JSON.parse(cachedData)
                return res.status(200).json({ success: true, message: 'this is cached data', user: userInfo })
            }

            // retrieve user information
            let userInfo = await sequelize.query(
                `
                SELECT 
                    u.user_id,
                    u.username,
                    u.full_name,
                    u.bio,
                    u.profile_image_url,
                    (SELECT COUNT(*) FROM follows WHERE follower_user_id = u.user_id) AS following,
                    (SELECT COUNT(*) FROM follows WHERE followed_user_id = u.user_id) AS followers,
                    EXISTS (
                        SELECT 1 
                        FROM follows 
                        WHERE follower_user_id = ? 
                        AND followed_user_id = ?
                    ) AS isFollowing
                FROM users u
                WHERE u.username = ?
                `
                , {
                    replacements: [me, checkUser.user_id, checkUser.username],
                    type: sequelize.QueryTypes.SELECT,
                    useMaster: false
                }
            )

            userInfo = userInfo[0]

            // No need to check for currently logged-in user (removed `me`)
            // if (String(userInfo.user_id) === String(me)) {
            //     delete userInfo.isFollowing
            // }

            // cache user information for 3 minutes
            await client.set(`user:${checkUser.user_id}`, JSON.stringify(userInfo), { EX: 180 })

            res.status(200).json({ success: true, user: userInfo })
        } catch (error) {
            console.log(error)
            res.status(500).json({ success: false, message: 'Internal server error' })
        }
    }


    // @route [GET] /user/:username/followers
    // @desc get user followers
    // @access Public
    async retrieveFollowers(req, res) {
        const { username } = req.params
        const me = req.user.user_id

        try {
            // get user_id
            const userResults = await User.findOne({
                where: { username: username },
                attributes: ['user_id']
            })

            if (!userResults || userResults.length === 0) {
                return res.status(400).json({ success: false, error: 'User not found' })
            }

            // check if data is cached
            const cachedData = await client.get(`followers:${userResults.user_id}`)
            if (cachedData) {
                const userInfo = JSON.parse(cachedData)
                return res.status(200).json({ success: true, message: 'this is cached data', user: userInfo })
            }

            // get followers
            const followerResults = await sequelize.query(
                `
                SELECT 
                    u.user_id,
                    u.username,
                    u.full_name,
                    u.profile_image_url,
                    CASE 
                        WHEN EXISTS (
                            SELECT 1 
                            FROM follows f2 
                            WHERE f2.follower_user_id = ? 
                            AND f2.followed_user_id = u.user_id
                        ) THEN 1
                        ELSE 0
                    END AS isFollowing
                FROM follows f
                JOIN users u ON f.follower_user_id = u.user_id
                WHERE f.followed_user_id = ?
                `
                , {
                    replacements: [me, userResults.user_id],
                    type: sequelize.QueryTypes.SELECT,
                    useMaster: false
                }
            )

            if (followerResults.length === 0) {
                return res.status(200).json({ success: true, message: 'No followers found.' })
            }

            // cache for 3 minutes
            await client.set(`followers:${userResults.user_id}`, JSON.stringify(followerResults), { EX: 180 })

            return res.status(200).json({ success: true, Follower: followerResults })
        } catch (error) {
            console.log(error)
            res.status(500).json({ success: false, message: 'Internal server error' })
        }
    }


    // @route [GET] /user/:username/following
    // @desc get user following
    // @access Public
    async retrieveFollowing(req, res) {
        const { username } = req.params
        const me = req.user.user_id

        try {
            // get user_id
            const userResults = await User.findOne({
                where: { username: username },
                attributes: ['user_id']
            })

            if (!userResults || userResults.length === 0) {
                return res.status(400).json({ success: false, error: 'User not found' })
            }

            // check if data is cached
            const cachedData = await client.get(`following:${userResults.user_id}`)
            if (cachedData) {
                const userInfo = JSON.parse(cachedData)
                return res.status(200).json({ success: true, message: 'this is cached data', user: userInfo })
            }

            // get following
            const followingResults = await sequelize.query(
                `
                SELECT 
                    u.user_id,
                    u.profile_image_url,
                    u.username,
                    u.full_name,
                    CASE 
                        WHEN EXISTS (
                            SELECT 1 
                            FROM follows f2 
                            WHERE f2.follower_user_id = ? 
                            AND f2.followed_user_id = u.user_id
                        ) THEN 1
                        ELSE 0
                    END AS isFollowing
                FROM follows f
                JOIN users u ON f.followed_user_id = u.user_id
                WHERE f.follower_user_id = ?
                `
                , {
                    replacements: [me, userResults.user_id],
                    type: sequelize.QueryTypes.SELECT,
                    useMaster: false
                }
            )

            if (followingResults.length === 0) {
                return res.status(200).json({ success: true, message: 'No followers found.' })
            }

            // cache for 3 minutes
            await client.set(`following:${userResults.user_id}`, JSON.stringify(followingResults), { EX: 180 })

            return res.status(200).json({ success: true, Following: followingResults })
        } catch (error) {
            console.log(error)
            res.status(500).json({ success: false, message: 'Internal server error' })
        }
    }


    // @route [POST] /user/:username/follow
    // @desc follow user
    // @access Private
    // async followUser(req, res) {
    //     const { username } = req.params
    //     const user_id = req.user.user_id

    //     const userResults = await User.findOne(
    //         { where: { username } },
    //         { attributes: ['user_id'] }
    //     )

    //     // check user existence
    //     if (!userResults) {
    //         return res.status(400).json({ success: false, error: 'User not found' })
    //     }

    //     // self-follow prevention
    //     if (userResults.user_id === user_id) {
    //         return res.status(400).json({ success: false, error: 'Cannot follow yourself' })
    //     }

    //     const userFollowed = userResults.user_id
    //     const transaction = await sequelize.transaction()
    //     try {
    //         // Check if already followed within transaction
    //         const checkFollowed = await Follow.findOne({
    //             where: { follower_user_id: user_id, followed_user_id: userFollowed },
    //             transaction,
    //         })

    //         if (!checkFollowed) {
    //             // Follow (within transaction)
    //             await Follow.create({
    //                 follower_user_id: user_id,
    //                 followed_user_id: userFollowed,
    //             }, { transaction })

    //             // Send follow activity notification (within transaction)
    //             sendFollowActivity(req, user_id, userFollowed, 'follows', 'Followed you', transaction)
    //         } else {
    //             // Unfollow (within transaction)
    //             await Follow.destroy({
    //                 where: {
    //                     follower_user_id: user_id,
    //                     followed_user_id: userFollowed,
    //                 },
    //                 transaction,
    //             })
    //         }

    //         await transaction.commit()
    //         return res.status(200).json({ success: true, message: (checkFollowed ? 'Unfollowed ! ! !' : 'Followed ! ! !') })
    //     } catch (error) {
    //         console.log(error)
    //         await transaction.rollback()
    //         return res.status(500).json({ success: false, message: 'Internal server error' })
    //     }
    // }
    async followUser(req, res) {
        const { username } = req.params
        const user_id = req.user.user_id

        try {
            // check if user exists
            const userResults = await User.findOne({
                where: { username },
                attributes: ['user_id']
            })

            if (!userResults) {
                return res.status(400).json({ success: false, error: 'User not found' })
            }

            if (userResults.user_id === user_id) {
                return res.status(400).json({ success: false, error: 'Cannot follow yourself' })
            }

            const userFollowed = userResults.user_id

            // check if already followed
            const checkFollowed = await Follow.findOne(
                { where: { follower_user_id: user_id, followed_user_id: userFollowed } }
            )

            if (!checkFollowed) {
                // follow
                await Follow.create({
                    follower_user_id: user_id,
                    followed_user_id: userFollowed
                })

                // send follow activity
                sendFollowActivity(req, user_id, userFollowed, 'follows', 'Followed you')

                // Update cached user's followers count
                const cachedData = await client.get(`user:${userFollowed}`)
                if (cachedData) {
                    const userInfo = JSON.parse(cachedData)
                    userInfo.followers = parseInt(userInfo.followers) + 1 // Parse followers count as integer
                    await client.set(`user:${userFollowed}`, JSON.stringify(userInfo), { EX: 180 })
                }

                return res.status(200).json({ success: true, message: 'Followed ! ! !' })
            }

            // if followed, unfollow
            await Follow.destroy(
                {
                    where: {
                        follower_user_id: user_id,
                        followed_user_id: userFollowed
                    }
                }
            )

            // Update cached user's followers count
            const cachedData = await client.get(`user:${userFollowed}`)
            if (cachedData) {
                const userInfo = JSON.parse(cachedData)
                userInfo.followers = parseInt(userInfo.followers) - 1
                await client.set(`user:${userFollowed}`, JSON.stringify(userInfo), { EX: 180 })
            }

            return res.status(200).json({ success: true, message: 'Unfollowed ! ! !' })
        } catch (error) {
            console.log(error)
            return res.status(500).json({ success: false, message: 'Internal server error' })
        }
    }


    // @route [GET] /user/:username/checkFollow
    // @desc check follow user
    // @access Private
    async checkFollow(req, res) {
        const { username } = req.params
        const user_id = req.user.user_id

        try {
            // check if user exists
            const userResults = await User.findOne(
                { where: { username } },
                { attributes: ['user_id'] }
            )

            if (!userResults) {
                return res.status(400).json({ success: false, error: 'User not found' })
            }

            const userFollowed = userResults.user_id

            // check if already followed
            const checkFollowed = await Follow.findOne(
                { where: { follower_user_id: user_id, followed_user_id: userFollowed } }
            )

            if (!checkFollowed) {
                return res.status(200).json({ success: true, message: 'Not following', isFollowing: false })
            }

            return res.status(200).json({ success: true, message: 'Following', isFollowing: true })
        } catch (error) {
            console.log(error)
            return res.status(500).json({ success: false, message: 'Internal server error' })
        }
    }

}

module.exports = new UserController()
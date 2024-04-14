const mysql_con = require('../config/db/mysql')
const Post = require('../models/Post')

class UserController {

    // @route [GET] /user/:username
    // @desc get user information
    // @access Public
    async retrieveUser(req, res) {
        const { username } = req.params

        try {
            // get user information
            const userExistQuery = `
                                   SELECT * FROM users
                                   WHERE username = ?
                                   `
            const getUserInfo = (userExistQuery) => {
                return new Promise((resolve, reject) => {
                    mysql_con.query(userExistQuery, [username], (error, results) => {
                        if (error) {
                            console.error('Error: ', error)
                            return res.status(500).json({ success: false, message: 'Internal server error' })
                        }

                        // check if user exists
                        if (results.length === 0) {
                            return res.status(400).json({ success: false, message: 'User not found' })
                        }

                        let userInfo = results[0]

                        delete userInfo.email
                        delete userInfo.password
                        delete userInfo.signup_date
                        delete userInfo.updated_at

                        resolve(userInfo)
                    })
                })

            }
            const userInfo = await getUserInfo(userExistQuery)

            // get user posts
            const userPosts = await Post
                .find({ user_id: userInfo.user_id }, 'caption media_url hashtags mentions createdAt likes_count comments_count')
                .sort({ createdAt: -1 })

            // get user followers
            const userFollowerQuery = `
                                       SELECT COUNT(*) as followers 
                                       FROM followers
                                       WHERE followed_user_id = ?
                                       `
            const getUserFollower = (userFollowerQuery) => {
                return new Promise((resolve, reject) => {
                    mysql_con.query(userFollowerQuery, [userInfo.user_id], (error, results) => {
                        if (error) {
                            console.error('Error: ', error)
                            return res.status(500).json({ success: false, message: 'Internal server error' })
                        }

                        resolve(results[0].followers)
                    })
                })
            }
            const userFollower = await getUserFollower(userFollowerQuery)

            // get user following
            const userFollowingQuery = `
                                       SELECT COUNT(*) as followers 
                                       FROM followers
                                       WHERE follower_user_id = ?
                                       `
            const getUserFollowing = (userFollowingQuery) => {
                return new Promise((resolve, reject) => {
                    mysql_con.query(userFollowingQuery, [userInfo.user_id], (error, results) => {
                        if (error) {
                            console.error('Error: ', error)
                            return res.status(500).json({ success: false, message: 'Internal server error' })
                        }

                        resolve(results[0].followers)
                    })
                })
            }
            const userFollowing = await getUserFollowing(userFollowingQuery)


            res.json({
                success: true,
                user: userInfo,
                posts: userPosts,
                followers: userFollower,
                following: userFollowing
            })
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
        const me = req.userId

        try {
            // get user_id
            const getUserIdQuery = `
                                   SELECT user_id 
                                   FROM users 
                                   WHERE username = ?
                                   `
            const [userResults] = await mysql_con.promise().query(getUserIdQuery, [username])
            if (!userResults || userResults.length === 0) {
                return res.status(400).json({ success: false, message: 'User not found' })
            }

            const userFollowerQuery = `
                                        SELECT 
                                            u.user_id,
                                            u.profile_image_url,
                                            u.username,
                                            u.full_name,
                                            CASE 
                                                WHEN EXISTS (
                                                    SELECT 1 
                                                    FROM followers f2 
                                                    WHERE f2.follower_user_id = ? 
                                                    AND f2.followed_user_id = u.user_id
                                                ) THEN 1
                                                ELSE 0
                                            END AS is_follow
                                        FROM followers f
                                        JOIN users u ON f.follower_user_id = u.user_id
                                        WHERE f.followed_user_id = ?
                                        `
            const [followerResults] = await mysql_con.promise().query(userFollowerQuery, [me, userResults[0].user_id])
            if (followerResults.length === 0) {
                return res.status(200).json({ success: true, message: 'No followers found.' })
            } else {
                return res.status(200).json({ success: true, Follower: followerResults })
            }
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
        const me = req.userId

        try {
            // get user_id
            const getUserIdQuery = `
                                   SELECT user_id 
                                   FROM users 
                                   WHERE username = ?
                                   `
            const [userResults] = await mysql_con.promise().query(getUserIdQuery, [username])
            if (!userResults || userResults.length === 0) {
                return res.status(400).json({ success: false, message: 'User not found' })
            }

            const userFollowingQuery = `
                                        SELECT 
                                            u.user_id,
                                            u.profile_image_url,
                                            u.username,
                                            u.full_name,
                                            CASE 
                                                WHEN EXISTS (
                                                    SELECT 1 
                                                    FROM followers f2 
                                                    WHERE f2.follower_user_id = ? 
                                                    AND f2.followed_user_id = u.user_id
                                                ) THEN 1
                                                ELSE 0
                                            END AS is_follow
                                        FROM followers f
                                        JOIN users u ON f.followed_user_id = u.user_id
                                        WHERE f.follower_user_id = ?
                                        `
            const [followingResults] = await mysql_con.promise().query(userFollowingQuery, [me, userResults[0].user_id])
            if (followingResults.length === 0) {
                return res.status(200).json({ success: true, message: 'No followers found.' })
            } else {
                return res.status(200).json({ success: true, Following: followingResults })
            }
        } catch (error) {
            console.log(error)
            res.status(500).json({ success: false, message: 'Internal server error' })
        }
    }


    // @route [POST] /user/:username/follow
    // @desc follow user
    // @access Private
    async followUser(req, res) {
        const { username } = req.params
        const user_id = req.userId

        try {
            // check if user exists
            const checkUserQuery = `
                                   SELECT * 
                                   FROM users 
                                   WHERE username = ?
                                   `
            const [userResults] = await mysql_con.promise().query(checkUserQuery, [username])
            if (!userResults || userResults.length === 0) {
                return res.status(400).json({ success: false, message: 'User not found' })
            }

            const userFollowed = userResults[0].user_id

            // check if already followed
            const checkFollowedUserQuery = `
                                           SELECT * 
                                           FROM followers 
                                           WHERE follower_user_id = ? 
                                           AND followed_user_id = ?
                                           `
            const [followedResult] = await mysql_con.promise().query(checkFollowedUserQuery, [user_id, userFollowed])
            if (!followedResult || followedResult.length === 0) {
                // follow
                const followQuery = `
                                    INSERT INTO followers (follower_user_id, followed_user_id) 
                                    VALUES (?, ?)
                                    `
                await mysql_con.promise().query(followQuery, [user_id, userFollowed])
                return res.status(200).json({ success: true, message: 'Followed ! ! !' })
            }

            // if followed, unfollow
            const unfollowQuery = `
                                  DELETE FROM followers 
                                  WHERE follower_user_id = ? 
                                  AND followed_user_id = ?
                                  `
            await mysql_con.promise().query(unfollowQuery, [user_id, userFollowed])
            return res.status(200).json({ success: true, message: 'Unfollowed ! ! !' })
        } catch (error) {
            console.log(error)
            return res.status(500).json({ success: false, message: 'Internal server error' })
        }
    }

}

module.exports = new UserController()

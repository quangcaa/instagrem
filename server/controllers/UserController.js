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
}

module.exports = new UserController()

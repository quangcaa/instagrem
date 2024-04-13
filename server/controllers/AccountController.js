const mysql_con = require('../config/db/mysql')
const { updateProfileValidator } = require('../utils/validation')

class AccountController {

    // @route [GET] /account/edit
    // @desc get user profile
    // @access Private
    async getProfile(req, res) {
        const user_id = req.userId

        try {
            const getProfileQuery = `
                                    SELECT username, email, full_name, bio, profile_image_url
                                    FROM users
                                    WHERE user_id = ?
                                    `
            mysql_con.query(getProfileQuery, [user_id], (error, results) => {
                if (error) {
                    console.log(error)
                    return res.status(500).json({ error: 'Internal Server Error' })
                }

                return res.send({ success: true, results })
            })
        } catch (error) {
            console.log(error)
            res.status(500).json({ success: false, message: 'Internal server error' })
        }
    }

    // @route [PUT] /account/edit
    // @desc update user profile
    // @access Private
    async updateProfile(req, res) {
        const { username, email, full_name, bio } = req.body
        const user_id = req.userId

        // check if user submit is valid
        const { error } = updateProfileValidator(req.body)
        if (error) {
            return res.status(422).send(error.details[0].message)
        }

        try {
            const updateProfileQuery = `
                                       UPDATE users
                                       SET 
                                        username = ?,
                                        email = ?,
                                        full_name = ?,
                                        bio = ?
                                       WHERE user_id = ?
                                       `
            mysql_con.query(updateProfileQuery, [username, email, full_name, bio, user_id], (error, results) => {
                if (error) {
                    console.error(error.stack)
                    return res.status(500).json({ error: "Internal Server Error" })
                }

                const getUserQuery = `
                                 SELECT username, email, full_name, bio, profile_image_url 
                                 FROM users 
                                 WHERE user_id = ?
                                 `
                mysql_con.query(getUserQuery, [user_id], (error, fetchResults) => {
                    if (error) {
                        console.error(error.stack)
                        return res.status(500).json({ error: "Internal Server Error" })
                    }

                    return res.status(201).send({ success: true, message: 'Profile updated successfully', user: fetchResults[0] })
                })
            })
        } catch (error) {
            console.error('Error: ', error)
            return res.status(500).json({ error: 'Internal Server Error' })
        }
    }

}

module.exports = new AccountController()
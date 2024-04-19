const mysql_con = require('../config/database/mysql')
const { updateProfileValidator } = require('../utils/validation')
const cloudinary = require('../config/storage/cloudinary')

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
            const [userProfile] = await mysql_con.promise().query(getProfileQuery, [user_id])

            return res.send({ success: true, profile: userProfile[0] })
        } catch (error) {
            console.error('Error getProfile function in AccountController: ', error)
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
            await mysql_con.promise().query(updateProfileQuery, [username, email, full_name, bio, user_id])

            return res.status(201).send({ success: true, message: 'Profile updated successfully' })
        } catch (error) {
            console.error('Error updateProfile function in AccountController: ', error)
            return res.status(500).json({ error: 'Internal Server Error' })
        }
    }


    // @route [PUT] /account/avatar
    // @desc change avatar profile
    // @access Private
    async changeAvatar(req, res) {
        const user_id = req.userId

        if (!req.file) {
            return res.status(400).json({ error: 'Please provide image.' })
        }

        try {
            // delete the last one
            // const deletaAvatarQuery = `
            //                            SELECT profile_image_url
            //                            FROM users
            //                            WHERE user_id = ?
            //                            `
            // const [lastAvatar] = await mysql_con.promise().query(deletaAvatarQuery, [user_id])
            // const parts = lastAvatar[0].profile_image_url.split('/')
            // const fileName = parts.pop() 
            // const id = fileName.split('.')[0]

            // const result = await cloudinary.uploader.destroy(id)
            // console.log(result)

            // upload avatar
            const avatarUpload = await cloudinary.uploader.upload(req.file.path, {
                folder: 'users',
                resource_type: 'image',
                width: 96,
                height: 96,
                crop: 'thumb',
                gravity: 'auto'
            })
            const avatarFile = avatarUpload.secure_url

            if (!avatarFile) {
                return res.status(500).json({ error: 'Avatar upload failed.' })
            }

            // update database
            const changeAvatarQuery = `
                                        UPDATE users
                                        SET profile_image_url = ?
                                        WHERE user_id = ?
                                        `
            await mysql_con.promise().query(changeAvatarQuery, [avatarFile, user_id])

            return res.status(200).json({ success: true, message: 'Changed avatar' })
        } catch (error) {
            console.error('Error changeAvatar function in AccountController: ', error)
            return res.status(500).json({ error: 'Internal Server Error' })
        }
    }


    // @route [DELETE] /account/avatar
    // @desc delete avatar profile
    // @access Private
    async deleteAvatar(req, res) {
        const user_id = req.userId
        const default_avatar_url = 'https://res.cloudinary.com/dzgglqmdc/image/upload/v1713180957/users/default_avatar.jpg'

        try {
            const deleteAvatarQuery = `
                                        UPDATE users
                                        SET profile_image_url = ?
                                        WHERE user_id = ?
                                        `
            await mysql_con.promise().query(deleteAvatarQuery, [default_avatar_url, user_id])

            return res.status(200).json({ success: true, message: 'Deleted avatar ! ! !' })
        } catch (error) {
            console.error('Error deleteAvatar function in AccountController: ', error)
            return res.status(500).json({ error: 'Internal Server Error' })
        }
    }

}

module.exports = new AccountController()
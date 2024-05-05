const { sequelize, User } = require('../mysql_models')
const { client } = require('../config/database/redis')

const cloudinary = require('../config/storage/cloudinary')

const { updateProfileValidator } = require('../utils/validation')

class AccountController {

    // @route [GET] /account/edit
    // @desc get user profile
    // @access Private
    async getProfile(req, res) {
        const user_id = req.user.user_id

        try {
            // retrieve profile from db
            const userProfile = await User.findOne({
                where: { user_id },
                attributes: ['user_id', 'username', 'email', 'full_name', 'bio', 'profile_image_url']
            })

            return res.send({ success: true, profile: userProfile })
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
        const user_id = req.user.user_id

        // check if user submit is valid
        const { error } = updateProfileValidator(req.body)
        if (error) {
            return res.status(422).json({ error: error.details[0].message })
        }

        try {
            // update profile to db
            const [updatedRows] = await User.update(
                { username, email, full_name, bio },
                { where: { user_id } }
            )

            // check if the profile was updated successfully
            if (updatedRows === 0) {
                return res.status(404).json({ success: false, error: 'User not found' })
            }

            // cache data in Redis
            await client.del(`user:${user_id}`)

            return res.status(201).send({ success: true, message: 'Profile updated successfully ! ! !' })
        } catch (error) {
            console.error('Error updateProfile function in AccountController: ', error)
            return res.status(500).json({ error: 'Internal Server Error' })
        }
    }


    // @route [PUT] /account/avatar
    // @desc change avatar profile
    // @access Private
    async changeAvatar(req, res) {
        const user_id = req.user.user_id

        if (!req.file) {
            return res.status(400).json({ error: 'Please provide image.' })
        }

        console.log(req.file)

        try {
            const b64 = Buffer.from(req.file.buffer).toString("base64");
            let dataURI = "data:" + req.file.mimetype + ";base64," + b64;

            // upload avatar
            const avatarUpload = await cloudinary.uploader.upload(dataURI, {
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
            await User.update(
                { profile_image_url: avatarFile },
                { where: { user_id } }
            )

            // cache data in Redis
            await client.del(`user:${user_id}`)

            return res.status(200).json({ success: true, message: 'Changed avatar ! ! !' })
        } catch (error) {
            console.error('Error changeAvatar function in AccountController: ', error)
            return res.status(500).json({ error: 'Internal Server Error' })
        }
    }


    // @route [DELETE] /account/avatar
    // @desc delete avatar profile
    // @access Private
    async deleteAvatar(req, res) {
        const user_id = req.user.user_id
        const default_avatar_url = 'https://res.cloudinary.com/dzgglqmdc/image/upload/v1714885396/users/default_avatar.jpg'

        try {
            // update the database
            await User.update(
                { profile_image_url: default_avatar_url },
                { where: { user_id } }
            )

            // Get the updated user profile from the database
            const updatedProfile = await User.findOne({
                where: { user_id },
                attributes: ['user_id', 'username', 'email', 'full_name', 'bio', 'profile_image_url']
            })

            // cache data in Redis
            await client.del(`user:${user_id}`)

            return res.status(200).json({ success: true, message: 'Deleted avatar ! ! !' })
        } catch (error) {
            console.error('Error deleteAvatar function in AccountController: ', error)
            return res.status(500).json({ error: 'Internal Server Error' })
        }
    }

}

module.exports = new AccountController()
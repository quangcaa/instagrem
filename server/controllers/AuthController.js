const argon2 = require('argon2')
require('dotenv').config()

const { registerValidator, changePasswordValidator } = require('../utils/validation')
const generateTokenAndSetCookie = require('../utils/generateToken')

const { client } = require('../config/database/redis')

const { User } = require('../mysql_models')

class AuthController {

    // @route POST /auth/login
    // @desc Login user
    // @access Public
    async login(req, res) {
        const { username, password } = req.body

        // check if username, email and password are provided
        if (!username || !password) {
            return res.status(400).json({ success: false, error: 'Missing username or email or password' })
        }

        try {
            // check if username already exists
            const user = await User.findOne({
                where: { username },
            })

            if (!user) {
                return res.status(401).json({ success: false, error: 'Invalid username or password' })
            }

            // check if password is correct
            const isPasswordValid = await argon2.verify(user.password, password)

            if (!isPasswordValid) {
                return res.status(401).json({ success: false, error: 'Invalid username or password' })
            }

            // delete password from user object
            delete user.dataValues.password
            delete user.dataValues.createdAt
            delete user.dataValues.updatedAt

            // log
            console.log('User login with ID: ' + user.user_id)

            // generate token & set cookie
            generateTokenAndSetCookie(user.user_id, res)

            // cache user data in Redis
            await client.set(`getProfile:${user.user_id}`, JSON.stringify(user), { EX: 60 })

            res.json({
                success: true, message: 'Login successful',
                user
            })
        } catch (error) {
            console.error('Error login function in AuthController: ', error)
            return res.status(500).json({ error: 'Internal Server Error' })
        }
    }


    // @route [POST] /auth/register
    // @desc Register user
    // @access Public
    async register(req, res) {
        const { username, email, password } = req.body
        const default_avatar_url = 'https://res.cloudinary.com/dzgglqmdc/image/upload/v1713180957/users/default_avatar.jpg'

        // validate
        const { error } = registerValidator(req.body)
        if (error) {
            return res.status(422).json({ error: error.details[0].message })
        }

        // hash the password
        const hashedPassword = await argon2.hash(password)

        try {
            // check if username already exists
            const checkUsername = await User.findOne({ where: { username } })

            if (checkUsername) {
                return res.status(409).json({ success: false, error: 'Username already exists' })
            }

            // if username does not exist, insert new user into the database
            const newUser = await User.create({
                username,
                email,
                password: hashedPassword,
                profile_image_url: default_avatar_url
            })

            // log 
            console.log('User registered with ID: ' + newUser.user_id)

            // generate token & set cookie
            generateTokenAndSetCookie(newUser.user_id, res)

            res.status(201).json({
                success: true, message: "User registered successfully",
                user: {
                    user_id: newUser.user_id,
                    username: newUser.username,
                    email: newUser.email,
                    profile_image_url: newUser.profile_image_url
                }
            })
        } catch (error) {
            console.error('Error register function in AuthController: ', error)
            return res.status(500).json({ error: 'Internal Server Error' })
        }
    }


    // @route [POST] /auth/logout
    // @desc Logout user
    // @access Private
    logout(req, res) {
        try {
            res.cookie('jwt', '', { maxAge: 0 })
            return res.status(200).json({ message: 'Logged out successfully' })
        } catch (error) {
            console.error('Error logout function in AuthController: ', error)
            return res.status(500).json({ error: 'Internal Server Error' })
        }
    }


    // @route [PATCH] /auth/changePassword
    // @desc change user account password
    // @access Private
    async changePassword(req, res) {
        const { oldPassword, newPassword } = req.body
        const user_id = req.user.user_id

        try {
            // get current user password
            const user = await User.findOne({
                where: { user_id },
                attributes: ['password']
            })

            // check if old password is correct
            const checkOldPassword = await argon2.verify(user.password, oldPassword)
            if (!checkOldPassword) {
                return res.status(401).json({ success: false, error: 'Invalid old password' })
            }

            // check if new password is valid
            const { error } = changePasswordValidator(newPassword)
            if (error) {
                return res.status(422).json({ error: error.details[0].message })
            }

            // hash new password
            const hashedPassword = await argon2.hash(newPassword)

            // update user password
            await User.update({
                password: hashedPassword,
                updated_at: new Date()
            }, {
                where: { user_id }
            })

            res.json({ success: true, message: 'Password changed successfully' })
        } catch (error) {
            console.error('Error changePassword function in AuthController: ', error)
            return res.status(500).json({ error: 'Internal Server Error' })
        }
    }
}

module.exports = new AuthController()
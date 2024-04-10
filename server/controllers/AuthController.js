const mysql_con = require('../config/db/mysql')
const argon2 = require('argon2')
const jwt = require('jsonwebtoken')
require('dotenv').config()

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
            // check if user exists
            const checkUserQuery = `
                                   SELECT * FROM users 
                                   WHERE username = ?
                                   `
            mysql_con.query(checkUserQuery, [username], async (error, results) => {
                if (error) {
                    console.error('Error: ', error)
                    return res.status(500).json({ error: 'Internal Server Error' })
                }
                if (results.length === 0) {
                    return res.status(401).json({ success: false, error: 'Invalid username or password' })
                }

                // check if password is correct
                const user = results[0]
                const isPasswordValid = await argon2.verify(user.password, password)

                if (!isPasswordValid) {
                    return res.status(401).json({ success: false, error: 'Invalid username or password' })
                }

                console.log('User login with ID: ' + user.user_id)

                // Return access token
                const accessToken = jwt.sign({ userId: user.user_id }, process.env.ACCESS_TOKEN_SECRET)
                res.json({ success: true, message: 'Login successful', accessToken })
                // req.session.user = user
            })
        } catch (error) {
            console.error('Error: ', error)
            return res.status(500).json({ error: 'Internal Server Error' })
        }
    }


    // @route POST /auth/register
    // @desc Register user
    // @access Public
    async register(req, res) {
        // get username, email and password from req.body
        const { username, email, password } = req.body

        // check if username, email and password are provided
        if (!username || !email || !password) {
            return res.status(400).json({ success: false, error: 'Missing username or email or password' })
        }

        // hash the password
        const hashedPassword = await argon2.hash(password)

        try {
            // check if username already exists
            const checkUsernameQuery = `
                                        SELECT *
                                        FROM users 
                                        WHERE username = ?
                                        `
            mysql_con.query(checkUsernameQuery, [username], (error, results) => {
                if (error) {
                    console.error('Error checking username: ' + error.stack)
                    return res.status(500).json({ error: "Internal Server Error" })
                }
                if (results.length > 0) {
                    return res.status(409).json({ suceess: false, error: "Username already exists" })
                }

                // if username does not exist, insert new user into the database
                const insertUserQuery = `
                                        INSERT INTO users (username, email, password) 
                                        VALUES (?, ?, ?)
                                        `
                mysql_con.query(insertUserQuery, [username, email, hashedPassword], (error, results) => {
                    if (error) {
                        console.error('Error registering user: ' + error.stack)
                        return res.status(500).json({ error: "Internal Server Error" })
                    }
                    console.log('User registered with ID: ' + results.insertId)

                    // create access token
                    const accessToken = jwt.sign({ userId: results.insertId }, process.env.ACCESS_TOKEN_SECRET)
                    res.status(201).json({ success: true, message: "User registered successfully", accessToken })
                })
            })
        } catch (error) {
            console.error('Error: ', error)
            return res.status(500).json({ error: 'Internal Server Error' })
        }
    }

    // @route POST /auth/logout
    // @desc Logout user
    // @access Private
    async logout (req, res) {
        res.json({ success: true, message: 'User logged out successfully' })
    }
}

module.exports = new AuthController()
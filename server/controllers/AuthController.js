const mysql_con = require('../config/db/mysql')
const argon2 = require('argon2')

class AuthController {
    
    async login(req, res, next) {
        const { username, password } = req.body

        try {
            const sqlQuery = `SELECT * FROM users WHERE username = ?`

            mysql_con.query(sqlQuery, [username], async (error, results) => {
                if (error) {
                    console.error('Error: ', error)
                    return res.status(500).json({ error: 'Internal Server Error' })
                }

                if (results.length === 0) {
                    return res.status(401).json({ error: 'Invalid username or password' })
                }

                const user = results[0]
                const isPasswordValid = await argon2.verify(user.password, password)

                if (!isPasswordValid) {

                    return res.status(401).json({ error: 'Invalid username or password' })
                }

                req.session.user = user
                res.json({ message: 'Login successful' })
            })
        } catch (error) {
            console.error('Error: ', error)
            return res.status(500).json({ error: 'Internal Server Error' })
        }
    }


    async register(req, res) {
        const { username, email, password } = req.body
        const hashed_password = await argon2.hash(password)

        const sqlQuery = `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`

        mysql_con.query(sqlQuery, [username, email, hashed_password], (error, results) => {
            if (error) {
                console.error('Error: ', error)
                return res.status(500).json({ error: 'Internal Server Error' })
            }
            res.json(results)
        })
    }

}

module.exports = new AuthController()
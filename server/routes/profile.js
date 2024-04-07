const express = require('express')
const router = express.Router()
const mysql_con = require('../config/db/mysql')

router.get('/:username', async (req, res) => {
    const username = req.params.username

    const sqlQuery = `SELECT * `
        + `FROM users `
        + `WHERE user_id = ?`

    mysql_con.query(sqlQuery, username, (error, results) => {
        if (error) {
            console.error('Error: ', error)
            return res.status(500).json({ error: 'Internal Server Error' })
        }
        res.json(results)
    })
})

module.exports = router
const express = require('express')
const router = express.Router()

const verifyToken = require('../middlewares/auth')

const userController = require('../controllers/UserController')

router.get('/:username', userController.retrieveUser)

module.exports = router
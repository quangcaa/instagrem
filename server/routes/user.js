const express = require('express')
const router = express.Router()

const { requireAuth, optionalAuth } = require('../middlewares/auth')

const userController = require('../controllers/UserController')

router.get('/:username', optionalAuth, userController.retrieveUser)

module.exports = router
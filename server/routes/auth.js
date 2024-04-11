const express = require('express')
const router = express.Router()

const authController = require('../controllers/AuthController')
const { requireAuth } = require('../middlewares/auth')

router.post('/login', authController.login)
router.post('/register', authController.register)
router.post('/logout', authController.logout)
router.patch('/changePassword', requireAuth, authController.changePassword)

module.exports = router
const express = require('express')
const router = express.Router()

const { requireAuth, optionalAuth } = require('../middlewares/auth')
const accountController = require('../controllers/AccountController')

router.get('/edit', requireAuth, accountController.getProfile)
router.put('/edit', requireAuth, accountController.updateProfile)

module.exports = router
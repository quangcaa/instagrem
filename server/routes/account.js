const express = require('express')
const router = express.Router()

const { requireAuth, optionalAuth } = require('../middlewares/auth')
const upload = require('../middlewares/multer')
const accountController = require('../controllers/AccountController')

router.put('/avatar', requireAuth, upload.single('image'), accountController.changeAvatar)
router.delete('/avatar', requireAuth, accountController.deleteAvatar)

router.get('/edit', requireAuth, accountController.getProfile)
router.put('/edit', requireAuth, accountController.updateProfile)

module.exports = router
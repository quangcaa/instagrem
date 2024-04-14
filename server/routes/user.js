const express = require('express')
const router = express.Router()

const { requireAuth, optionalAuth } = require('../middlewares/auth')
const userController = require('../controllers/UserController')

router.get('/:username', optionalAuth, userController.retrieveUser)

router.get('/:username/followers', requireAuth, userController.retrieveFollowers)
router.get('/:username/following', requireAuth, userController.retrieveFollowing)

router.post('/:username/follow', requireAuth, userController.followUser)


// router.post('/',)

module.exports = router
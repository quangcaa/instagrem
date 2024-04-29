const express = require('express')
const router = express.Router()

const { requireAuth } = require('../middlewares/auth')
const userController = require('../controllers/UserController')

router.get('/:identifier', requireAuth, userController.retrieveUser)

router.get('/:username/followers', requireAuth, userController.retrieveFollowers)
router.get('/:username/following', requireAuth, userController.retrieveFollowing)

router.post('/:username/follow', requireAuth, userController.followUser) 
router.get('/:username/checkFollow', requireAuth, userController.checkFollow) 

module.exports = router
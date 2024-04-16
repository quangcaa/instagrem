const express = require('express')
const router = express.Router()

const { requireAuth, optionalAuth } = require('../middlewares/auth')
const activityController = require('../controllers/ActivityController')

router.get('/', requireAuth, activityController.retrieveActivity)

router.put('/', requireAuth, activityController.readActivity)

module.exports = router
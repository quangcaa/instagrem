const express = require('express')
const router = express.Router()

const { requireAuth } = require('../middlewares/auth')

const directController = require('../controllers/DirectController')

router.get('/inbox', requireAuth, directController.retrieveInbox)

router.get('/c/:partner_id', requireAuth, directController.getMessage)
router.post('/u/:user_id', requireAuth, directController.sendMessage)

module.exports = router
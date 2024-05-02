const express = require('express')
const router = express.Router()

const {requireAuth} = require('../middlewares/auth')
const searchController = require('../controllers/SearchController')

router.get('/:searchText', requireAuth, searchController.search)

module.exports = router
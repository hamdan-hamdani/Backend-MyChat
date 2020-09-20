const express = require('express')
const router = express.Router()
const user = require('./user')
const personalChat = require('./personalChat')

router
  .use('/users', user)
  .use('/connection', personalChat)

module.exports = router

const express = require('express')
const pcController = require('../controllers/personalChat')
const router = express.Router()

router
  .post('/register', pcController.register)
  .post('/login', pcController.login)

module.exports = router

const express = require('express')
const userController = require('../controllers/user')
const router = express.Router()

router
  .post('/register', userController.register)
  .post('/login', userController.login)
  .get('/user/:email', userController.cekUser)
  .post('/addfriend', userController.addFriend)
  .get('/addfriend/:idUser', userController.getaddFriend)
  .get('/getfriend/:idUser/:idFriend', userController.getFriend)
  .get('/getuser/:idUser', userController.getUser)

module.exports = router

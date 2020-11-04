const express = require('express')
const userController = require('../controllers/user')
const router = express.Router()
const { upload, verifyAccess, chacheGetAllProduct, clearCache } = require('../middlewares/middlewares')

router
  .post('/register', userController.register)
  .post('/login', userController.login)
  .post('/forgotPassword', userController.forgotPassword)
  .get('/user/:email', userController.cekUser)
  .get('/userbyid/:id', verifyAccess, userController.cekUserbyid)
  .patch('/userbyid/:id', verifyAccess, upload.single('file'), userController.updateUserbyid)
  .post('/addfriend', verifyAccess, userController.addFriend)
  .delete('/addfriend/:idUser/:idFriend', verifyAccess, userController.removeFriend)
  .get('/addfriend/:idUser', verifyAccess, userController.getaddFriend)
  .get('/getfriend/:idUser/:idFriend',verifyAccess, userController.getFriend)
  .get('/getuser/:idUser', verifyAccess, userController.getUser)
  .post('/getmessage/', verifyAccess, userController.addMessage)
  .get('/getmessage/:idUser/:idFriend', verifyAccess, userController.getMessage)
  .get('/notifmsg/:idFriend', verifyAccess, userController.notifMsg)
  .post('/notifmsg', verifyAccess, userController.postNotifMsg)
  .patch('/notifmsg/:idUser/:idFriend/:noMsg', verifyAccess, userController.updateNotifMsg)

module.exports = router
